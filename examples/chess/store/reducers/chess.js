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

const fnMap = {
  Horse: function(x0,y0,x1,y1){

    return (Math.abs(x0 - x1) === 1 && Math.abs(y0 - y1) === 2) || (Math.abs(x0 - x1) === 2 && Math.abs(y0 - y1) === 1);
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


  },
  [types.SELECT_CHESS](state,a){
    var checkMoveFn = fnMap[a.chessType];

    var arr = state.map((row,y)=>{
      return row.map((code,x)=>{
        if(checkMoveFn(x,y,a.x,a.y)){
          return {
            type:'move'
          };
        }else{
          return code;
        }
      });
    });
    return arr;
  },
  [types.CLEAR_CHESS](state,obj){

    var arr = state.map((row,y)=>{
      return row.map((code,x)=>{
        if(code.type === 'move'){
          return INIT_CODE;
        }
        return code;
      });
    });
    return arr;
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
createReducer.struct = struct;

module.exports = createReducer;