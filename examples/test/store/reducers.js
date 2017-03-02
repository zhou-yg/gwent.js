/**
 * Created by zyg on 17/3/2.
 */
import {
  TEST,
  TEST2
} from './types'

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
  [TEST](state,a){
    return state + a.value;
  },
  [TEST2](state,a){
    return state - a.value;
  }
}

export default struct(reducer,0);