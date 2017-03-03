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
  [types.TEST](state,a){
    return state + a.value;
  },
  [types.TEST2](state,a){
    return state - a.value;
  }
}

module.exports = struct(reducer,0);