/**
 * Created by zyg on 17/3/2.
 */
const types = require('../types');

function struct(handler,defaultState) {

  return function handlerFn(state,action){

    if(state === undefined){
      state = defaultState;
    }

    if(handler[action.type]){
      return handler[action.type](state,action)
    }

    return state;
  }
}


const reducer = {
  [types.FIND_PLAYER](state,a){
    return a.player;
  },

  [types.CHESS_MOVE](state,a){
    
    return state;
  }
}

module.exports = struct(reducer,[]);