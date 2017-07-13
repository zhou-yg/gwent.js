'use strict';

var shortid = require('shortid');
var chalk = require('chalk');
// const koaIO = require('koa.io');
var Koa = require('koa');
var http = require('http');
var socketIO = require('socket.io');

var types = require('./types');
var socketMiddleware = require('./socketMiddleware');

var __SOCKET_ROUTE_ACTION = '__SOCKET_ROUTE_ACTION';

var workId = process.env.UNIQUE_ID || 0;
workId = Number(workId);
if (isNaN(workId)) {
  workId = 0;
}

shortid.worker(workId);

var i = 0;

function addSocketAction(store) {

  store.socketDispatch = function (action) {

    store[__SOCKET_ROUTE_ACTION] = action;

    store.dispatch(action);
  };

  return store;
}

function Gwent(options) {

  if (!(this instanceof Gwent)) {
    return new Gwent(options);
  }

  var createStore = options.createStore;
  var onConnect = options.onConnect || function () {};
  var onDisconnect = options.onDisconnect || function () {};

  var app = new Koa();
  var server = http.createServer(app.callback());
  var io = socketIO(server);

  var ioConnectionSet = new Set();

  io.on('connection', function (socket) {
    var _this = this;

    var store = addSocketAction(createStore(socket));
    socket.store = store;

    routeEvents.forEach(function (eventArguments) {
      socket.on.apply(socket, eventArguments);
    });

    onConnect.call(socket, socket);

    var unSubscribe = store.subscribe(function () {
      if (store[__SOCKET_ROUTE_ACTION]) {

        console.log('server getState:', _this.id);
        console.log('lastAction:', store[__SOCKET_ROUTE_ACTION]);

        var action = Object.assign({
          i: i++,
          isSelf: true
        }, store[__SOCKET_ROUTE_ACTION]);

        socket.emit(types.SOCKET_ROUTE, action);

        store[__SOCKET_ROUTE_ACTION] = null;
      }
    });

    socket.on(types.SOCKET_ROUTE, function (action) {

      console.log('socket route');

      action.from = 'by default route';
      action.isSelf = true;

      store.socketDispatch(action);
    });

    socket.on('disconnect', function (reasonMessage) {

      onDisconnect.call(socket, socket);
      unSubscribe();
    });
  });

  app.listen = function () {
    return server.listen.apply(server, arguments);
  };

  app.io = io;

  var routeEvents = [];

  app.io.route = function () {
    var arg = arguments;

    routeEvents.push(arg);
  };

  return app;
}

Gwent.types = types;
Gwent.socketMiddleware = socketMiddleware;

module.exports = Gwent;