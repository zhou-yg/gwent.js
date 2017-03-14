/**
 * Created by zyg on 17/3/2.
 */
'use strict';
const _ = require('lodash');
const types = require('../types');
const INIT_CODE = require('./chess').INIT_CODE;
const WIDTH = require('./chess').WIDTH - 1;
const HEIGHT = require('./chess').HEIGHT - 1;

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

function transformToPlayer (arr) {
  arr = arr.slice().map(arr=>{
    return arr.slice();
  });

  var result = [];

  while(arr.length > 0){
    let childArr = arr.pop();
    let copyChildArr = [];
    while(childArr.length > 0){
      copyChildArr.push(childArr.pop());
    }
    result.push(copyChildArr);
  }
  return result;
}

function transformAction (action){
  if((action.x || action.x ===0) && (action.y || action.y === 0)){
    action.x = WIDTH - action.x;
    action.y = HEIGHT - action.y;
  }
  return action
}

const reducer = {
  [types.CHESS_ADD](state, a){

    if(!a.isSelf){
      const horse = transformAction(a.horse);

      state[horse.y][horse.x] = horse;

      return state.slice();
    }
    return state;
  },
  [types.FIND_PLAYER](state,a){
    return transformToPlayer(a.player);
    // return a.player;
  },

  [types.CHESS_MOVE](state,a){

    if(!a.isSelf){
      a.selectChess = transformAction(a.selectChess);
      a.to = transformAction(a.to);

      const obj = state[a.selectChess.y][a.selectChess.x];

      state[a.selectChess.y][a.selectChess.x] = INIT_CODE;
      state[a.to.y][a.to.x] = obj;

      return state.slice();
    }
    return state;
  }
}

module.exports = struct(reducer,[]);