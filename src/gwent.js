const shortid = require('shortid');

const koaIO = require('koa.io');

const types = require('./lib/types');

const actionRedirect = require('./lib/actionRedirect');
const receiveSocket = require('./lib/receiveSocket');

const __SOCKET_ROUTE_ACTION = '__SOCKET_ROUTE_ACTION';

var workId = process.env.UNIQUE_ID || 0;
workId = Number(workId);
if(isNaN(workId)){
  workId = 0;
}

shortid.worker(workId);


function addSocketAction(store){

  store.socketDispatch = function(action){

    store[__SOCKET_ROUTE_ACTION] = action;

    store.dispatch(action);
  };

  return store;
}

function Gwent(options){

  if(!(this instanceof Gwent)){
    return new Gwent(options);
  }

  const createStore = options.createStore;
  const onConnect = options.onConnect || function(){};
  const onDisconnect = options.onDisconnect || function(){};

  const app = koaIO();

  app.io.use(function * (next){

    try {
      this.store = addSocketAction(createStore(this.socket));

      onConnect.call(this);

      var i = 0;
      const unSubscribe = this.store.subscribe(()=> {

        if(this.store[__SOCKET_ROUTE_ACTION]) {
          
          console.log('server getState:', this.socket.id);
          console.log('lastAction:', this.store[__SOCKET_ROUTE_ACTION]);

          const action = Object.assign({
            i:i++,
            isSelf:true,
          },this.store[__SOCKET_ROUTE_ACTION]);


          this.emit(types.SOCKET_ROUTE, action);

          this.store[__SOCKET_ROUTE_ACTION] = null;
        }
      });

      yield next;

      onDisconnect.call(this);

      unSubscribe();
    }catch(e){
      console.log(e);
    }

  });

  app.io.route(types.SOCKET_ROUTE, function * (next,action){

    action.from = 'by default route';
    action.isSelf = true;

    this.store.socketDispatch(action);
  });

  return app;
}

Gwent.types = types;
Gwent.actionRedirect = actionRedirect;
Gwent.receiveSocket = receiveSocket;

module.exports = Gwent;