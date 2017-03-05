const redux = require('redux');

const createStore = redux.createStore;
const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;

const reducers = require('./reducers');

const tools = require('../../../tools');

const testMiddleware = (store) => next => action => {

  console.log('test');

  return next(action)
};

module.exports = function createMyStore(socket) {

  console.log('socket:',socket.socket && socket.socket.on);

  const store = createStore(combineReducers({
    value:reducers
  }),applyMiddleware(
    tools.receiveSocket(socket),
    tools.actionRedirect(socket)
  ));


  return store;
};
