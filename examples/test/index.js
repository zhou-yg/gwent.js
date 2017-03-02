import store from './store/store'

window.S = store;

store.subscribe(()=>{
  console.log(store.getState())
});
