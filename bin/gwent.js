const shortid = require('shortid');

const koaIO = require('koa.io');

const types = require('./types');

const actionRedirect = require('./actionRedirect');
const receiveSocket = require('./receiveSocket');

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

      this.socketId = shortid.generate();

      const unSubscribe = this.store.subscribe(()=> {

        console.log('getState:', this.store.getState());
      });

      onConnect.call(this);

      yield next;

      onDisconnect.call(this);

      unSubscribe();
    
  });

  app.io.route(types.SOCKET_ROUTE, function * (next,action){

    console.log(action);

    action.from = types.SERVER_TAG;

    this.store.dispatch(action);
  });

  return app;
}

Gwent.types = types;
Gwent.actionRedirect = actionRedirect;
Gwent.receiveSocket = receiveSocket;

module.exports = Gwent;