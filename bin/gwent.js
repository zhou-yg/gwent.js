const shortid = require('shortid');

const koaIO = require('koa.io');

const types = require('./types');

const actionRedirect = require('./actionRedirect');
const receiveSocket = require('./receiveSocket');

var workId = process.env.UNIQUE_ID || 0;
workId = Number(workId);
if(isNaN(workId)){
  workId = 0;
}

shortid.worker(workId);

function Gwent(options){

  if(!(this instanceof Gwent)){
    return new Gwent(options);
  }

  const createStore = options.createStore;
  const onConnect = options.onConnect || function(){};
  const onDisconnect = options.onDisconnect || function(){};

  const app = koaIO();

  app.io.use(function * (next){

      this.store = createStore(this.socket);

      onConnect.call(this);

      const unSubscribe = this.store.subscribe(()=> {

        console.log(this.socket.id,'server getState:');

        console.log(this.store.lastAction);

        this.socket.emit(types.SOCKET_ROUTE,this.store.lastAction);
      });

      yield next;

      onDisconnect.call(this);

      unSubscribe();

  });

  app.io.route(types.SOCKET_ROUTE, function * (next,action){

    // action.from = types.SERVER_TAG;
    this.store.lastAction = action;

    this.store.dispatch(action);
  });

  return app;
}

Gwent.types = types;
Gwent.actionRedirect = actionRedirect;
Gwent.receiveSocket = receiveSocket;

module.exports = Gwent;