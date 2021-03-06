const shortid = require('shortid');
const chalk = require('chalk');
// const koaIO = require('koa.io');
const Koa = require('koa');
const http = require('http');
const socketIO = require('socket.io');

const types = require('./types');
const socketMiddleware = require('./socketMiddleware');

const __SOCKET_ROUTE_ACTION = '__SOCKET_ROUTE_ACTION';

var workId = process.env.UNIQUE_ID || 0;
workId = Number(workId);
if(isNaN(workId)){
  workId = 0;
}

shortid.worker(workId);

var i = 0;

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

  const app = new Koa();
  const server = http.createServer(app.callback());
  const io = socketIO(server);

  const ioConnectionSet = new Set();

  io.on('connection', function(socket){

    const store = addSocketAction(createStore(socket));
    socket.store = store;

    routeEvents.forEach(eventArguments => {
      socket.on.apply(socket, eventArguments);
    });

    onConnect.call(socket, socket);

    const unSubscribe = store.subscribe(() => {
      if(store[__SOCKET_ROUTE_ACTION]) {

        console.log('server getState:', this.id);
        console.log('lastAction:', store[__SOCKET_ROUTE_ACTION]);

        const action = Object.assign({
          i:i++,
          isSelf:true,
        },store[__SOCKET_ROUTE_ACTION]);


        socket.emit(types.SOCKET_ROUTE, action);

        store[__SOCKET_ROUTE_ACTION] = null;
      }
    });

    socket.on(types.SOCKET_ROUTE, function (action){

      console.log(`socket route`);

      action.from = 'by default route';
      action.isSelf = true;

      store.socketDispatch(action);
    });

    socket.on('disconnect', (reasonMessage) => {

      onDisconnect.call(socket, socket);
      unSubscribe();
    });
  });


  app.listen = function () {
    return server.listen.apply(server, arguments);
  }

  app.io = io;

  const routeEvents = [];

  app.io.route = function () {
    var arg = arguments;

    routeEvents.push(arg);
  }

  return app;
}

Gwent.types = types;
Gwent.socketMiddleware = socketMiddleware;

module.exports = Gwent;
