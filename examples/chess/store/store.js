const redux = require('redux');

const createStore = redux.createStore;
const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;

const chess = require('./reducers/chess');
const player = require('./reducers/player');

const middlewares = require('../../../middlewares');

module.exports = function createMyStore(socket,options) {
  if(!options){
    options = {};
  }
  // console.log('socket:',socket.socket && socket.socket.on);

  const browser = options.browser;

  var enhancer;
  if(browser){
    enhancer = applyMiddleware(
      middlewares.receiveSocket(socket),
      middlewares.actionRedirect(socket)
    );
  }else{
    enhancer = applyMiddleware(
      middlewares.actionRedirect(socket)
    );
  }

  const store = createStore(combineReducers({
    boardIndex:chess(),
    player,
  }),enhancer);


  return store;
};
