const path = require('path');
const fs = require('fs');
const gwent = require('../../');
const babel = require('babel-core');
const webpack = require('webpack');
const app = require('koa.io')();

const MemoryFS = require('memory-fs');
const mfs = new MemoryFS();

var  createStore = require('./store/store.js');

const webpackConfig = {

  entry:{
    client:path.join(__dirname,'index.js'),
  },
  output:{
    path:__dirname,
    publicPath:'/',
    filename:'[name].js'
  },
  resolve:{
    extensions:['.js']
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        loader:'babel-loader',
        exclude:/node_modules/
      }
    ]
  }
}

const  storeWebpackConfig = Object.assign({},webpackConfig,{
  entry:{
    store:path.join(__dirname,'./store/store.js'),
  },
  target:'node'
});

var compiler = webpack(webpackConfig);
compiler.outputFileSystem = mfs;

// const storeCompiler = webpack(storeWebpackConfig);
// storeCompiler.run((err,stats)=>{
//
//   createStore = require(path.join(__dirname,'./store.js'));
//
//   console.log('createStore:',createStore,createStore.default);
// });

function jsContent(){
  return new Promise(resolve=>{
    compiler.run((err,stats)=>{

      var content = mfs.readFileSync(path.join(__dirname,'./client.js'));

      resolve(content);
    });
  });
}

app.use(function * (next){

  if(/index\.js$/.test(this.request.path)){
    this.response.set('Content-type','application/javascript');

    this.body = yield jsContent();

  }else{
    yield next;
  }
})

app.use(function * (){
  this.response.set('Content-type','text/html');
  this.body= fs.createReadStream('./index.html');
});


app.io.use(function * (next){

  console.log('connect');

  try{
    this.store = createStore(this.socket);
    const unsub = this.store.subscribe(()=>{

      console.log(store.getState());


    });
  }catch(e){
    console.log('e:',e);
  }

  console.log('connect2');

  yield next;

  console.log('disconnect connect');

  unsub();
});
var i = 0;
app.io.route('testx' , function * (next,action) {

  console.log(action);

  action.from = 'server';
  
  this.store.dispatch(action).then(res=>{

    console.log('resolved');
  });
});

app.io.route('test2' , function * (next,action) {

  console.log('m2:',action);

});

app.listen(9999);
console.log('listen on 9999');
