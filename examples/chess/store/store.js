const redux = require('redux');

const createStore = redux.createStore;
const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;

const chess = require('./reducers/chess');
const player = require('./reducers/player');

const middlewares = require('../../../middlewares');

module.exports = function createMyStore(socket) {

  console.log('socket:',socket.socket && socket.socket.on);

  const store = createStore(combineReducers({
    boardIndex:chess,
    player,
  }),applyMiddleware(
    middlewares.receiveSocket(socket),
    middlewares.actionRedirect(socket)
  ));


  return store;
};
