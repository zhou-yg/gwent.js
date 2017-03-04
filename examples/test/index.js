import createStore from './store/store'
import { TEST,TEST2 } from './store/types'

const socket = io();

const store = createStore(socket);


window.S = store;

store.subscribe(()=>{
  console.log(store.getState())
});

socket.on('testx',(m)=>{

  console.log('from server',m);
});

window.add1 = function(){

  store.dispatch({
    type:TEST,
    from:'browser',
    value:2,

  });
};
window.reduce1 = function (){
  store.dispatch({
    type:TEST2,
    from:'browser',
    value:1,
  })
  
}
