/**
 * Created by zyg on 17/3/2.
 */
const types = require('../types');

const INIT_CODE = 0;

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
  [types.CHESS_ADD](state,a){

    const horse = a.horse;

    state[horse.y][horse.x] = horse;



    return state.slice();
  },
  [types.CHESS_MOVE](state,a){

    console.log('a:',a);

    const obj = state[a.selectChess.y][a.selectChess.x];

    state[a.selectChess.y][a.selectChess.x] = INIT_CODE;
    state[a.to.y][a.to.x] = obj;

    return state.slice();

  },
  [types.CLICK_ON_GRID](state,a){


  }
};


const index = [
  [INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE],
  [INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE],
  [INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE],
  [INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE],
  [INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE],
  [INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE],
  [INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE],
  [INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE,INIT_CODE],
];

const structReducer = struct(reducer,index);

structReducer.INIT_CODE = INIT_CODE;

module.exports = structReducer;