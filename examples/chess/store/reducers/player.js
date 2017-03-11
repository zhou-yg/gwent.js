/**
 * Created by zyg on 17/3/2.
 */
const types = require('../types');
const INIT_CODE = require('./chess').INIT_CODE;

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

    if(!a.isSelf){
      console.log('对手移动了');

      const obj = state[a.selectChess.y][a.selectChess.x];

      state[a.selectChess.y][a.selectChess.x] = INIT_CODE;
      state[a.to.y][a.to.x] = obj;

      return state.slice();
    }
    return state;
  }
}

module.exports = struct(reducer,[]);