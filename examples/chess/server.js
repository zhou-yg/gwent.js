const path = require('path');
const fs = require('fs');
const babel = require('babel-core');
const webpack = require('webpack');
const Gwent = require('../../');

const MemoryFS = require('memory-fs');
const mfs = new MemoryFS();

const createStore = require('./store/store.js');
const types = require('./store/types.js');

const userMap = {};

var i = 0;

const app = Gwent({
  createStore,
  onConnect(){
    console.log('connect');

    this.userData = {
      username: 'u' + (i++),
      store: this.store,
    };

    userMap[this.socket.id] = this.userData;
    try {

    } catch (e) {
      console.log(e);
    }
  },
  onDisconnect(){
    console.log('disconnect');

    delete userMap[this.socket.id];
  }
});

const webpackConfig = {

  entry: {
    client: path.join(__dirname, 'index.js'),
  },
  output: {
    path: __dirname,
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
        exclude: /node_modules/
      }
    ]
  }
};

var compiler = webpack(webpackConfig);
compiler.outputFileSystem = mfs;

function jsContent() {
  return new Promise(resolve=> {
    compiler.run((err, stats)=> {

      var content = mfs.readFileSync(path.join(__dirname, './client.js'));

      resolve(content);
    });
  }).catch(e=> {
    console.log(e);
  });
}

app.use(function *(next) {

  if (/index\.js$/.test(this.request.path)) {
    this.response.set('Content-type', 'application/javascript');

    this.body = yield jsContent();

  } else {
    yield next;
  }
})

app.use(function *() {
  this.response.set('Content-type', 'text/html');
  this.body = fs.createReadStream('./index.html');
});

app.io.route('new user', function *() {
  console.log('new user');

  try{
    this.emit('users', Object.keys(userMap).map(k=> {
      return {
        username: userMap[k].username,
      }
    }));
    this.broadcast.emit('users', Object.keys(userMap).map(k=> {
      return {
        username: userMap[k].username,
      }
    }));
  }catch(e){

  }
});
app.io.route('match user',function * (next,username){
  
  if(username !== this.userData.username){

    var findPlayer = null;

    Object.keys(userMap).map(socketId=>{
      if(userMap[socketId].username === username ){
        findPlayer = userMap[socketId];
      }
    });

    console.log('findPlayer:',findPlayer);


    findPlayer.store.lastAction = {
      type:types.FIND_PLAYER,
      player:this.store.getState().boardIndex,
    };
    findPlayer.store.dispatch(findPlayer.store.lastAction);


    this.store.lastAction = {
      type:types.FIND_PLAYER,
      player:findPlayer.store.getState().boardIndex,
    };
    this.store.dispatch(this.store.lastAction);


  }else{
    this.emit('log','同名')
  }
});

app.listen(9999, ()=> {
  console.log('listen on 9999');
});
