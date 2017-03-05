/**
 * Created by zyg on 17/3/2.
 */
const types = require('./types');

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



  },
  [types.CLICK_ON_GRID](state,a){


  }
};

const INIT_CODE = 0;

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