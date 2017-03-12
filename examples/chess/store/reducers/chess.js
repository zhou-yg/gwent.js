/**
 * Created by zyg on 17/3/2.
 */
const types = require('../types');

const INIT_CODE = 0;

function struct(handler, defaultState) {

  return function handlerFn(state, action) {

    if (state === undefined) {
      state = defaultState;
    }

    if (handler[action.type]) {
      return handler[action.type](state, action)
    }

    return state;
  }
}


const reducer = {
  [types.CHESS_ADD](state, a){

    if(a.isSelf){
      const horse = a.horse;

      state[horse.y][horse.x] = horse;

      console.log(state);

      return state.slice();
    }
    return state;
  },
  [types.CHESS_MOVE](state, a){
    if(a.isSelf) {

      console.log('CHESS_MOVE :', a);

      const obj = state[a.selectChess.y][a.selectChess.x];

      state[a.selectChess.y][a.selectChess.x] = INIT_CODE;
      state[a.to.y][a.to.x] = obj;

      return state.slice();
    }
    return state;
  },
  [types.CLICK_ON_GRID](state, a){


  }
};

const index = () => [
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
];


function createReducer() {




  const structReducer = struct(reducer, index());

  return structReducer;
};

createReducer.INIT_CODE = INIT_CODE;
createReducer.HEIGHT = index().length;
createReducer.WIDTH = index()[0].length;

module.exports = createReducer;