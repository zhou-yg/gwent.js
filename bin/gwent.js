'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shortid = require('shortid');

var koaIO = require('koa.io');

var types = require('./lib/types');

var actionRedirect = require('./lib/actionRedirect');
var receiveSocket = require('./lib/receiveSocket');

var __SOCKET_ROUTE_ACTION = '__SOCKET_ROUTE_ACTION';

var workId = process.env.UNIQUE_ID || 0;
workId = Number(workId);
if (isNaN(workId)) {
  workId = 0;
}

shortid.worker(workId);

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

  var app = koaIO();

  app.io.use(_regenerator2.default.mark(function _callee(next) {
    var _this = this;

    var i, unSubscribe;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            this.store = addSocketAction(createStore(this.socket));

            onConnect.call(this);

            i = 0;
            unSubscribe = this.store.subscribe(function () {

              if (_this.store[__SOCKET_ROUTE_ACTION]) {

                console.log('server getState:', _this.socket.id);
                console.log('lastAction:', _this.store[__SOCKET_ROUTE_ACTION]);

                var action = (0, _assign2.default)({
                  i: i++,
                  isSelf: true
                }, _this.store[__SOCKET_ROUTE_ACTION]);

                _this.emit(types.SOCKET_ROUTE, action);

                _this.store[__SOCKET_ROUTE_ACTION] = null;
              }
            });
            _context.next = 7;
            return next;

          case 7:

            onDisconnect.call(this);

            unSubscribe();

            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](0);

            console.log('error:', _context.t0);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  app.io.route(types.SOCKET_ROUTE, _regenerator2.default.mark(function _callee2(next, action) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:

            action.from = 'by default route';
            action.isSelf = true;

            this.store.socketDispatch(action);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return app;
}

Gwent.types = types;
Gwent.actionRedirect = actionRedirect;
Gwent.receiveSocket = receiveSocket;

module.exports = Gwent;