import store from './store/store'
import { TEST,TEST2 } from './store/types'
window.S = store;

store.subscribe(()=>{
  console.log(store.getState())
});


window.add1 = function(){
  
  
  
  store.dispatch({
    type:TEST,
    value:2,
    
  })
};
window.reduce1 = function (){
  store.dispatch({
    type:TEST2,
    value:1,

  })
  
}
