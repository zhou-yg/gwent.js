const path = require('path');
const fs = require('fs');
const babel = require('babel-core');
const webpack = require('webpack');
const Gwent = require('../../');

const MemoryFS = require('memory-fs');
const mfs = new MemoryFS();

const  createStore = require('./store/store.js');

const app = Gwent({
  createStore,
  onConnect(){
    console.log('connect');
  },
  onDisconnect(){
    console.log('disconnect');
  }
});

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
};

var compiler = webpack(webpackConfig);
compiler.outputFileSystem = mfs;

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


app.listen(9999);
console.log('listen on 9999');
