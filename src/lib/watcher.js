/**
 * Created by zyg on 17/3/15.
 */
/**
 *
 * watcher:{
 *   'boardIndex':function(newValue,oldValue){
 *      ...trigger
 *   },
 * }
 *
 */
function watcher(store, register ){

  var initState = store.getState();

  if(Object.keys(register).every(fnName=>{
      return typeof register[fnName] !== 'function';
    })){
    throw new Error('callback must be function');
  }

  store.subscribe(()=>{

    var newState = store.getState();

    Object.keys(newState).map(key=>{
      if(register[key]) {
        const newValue = newState[key];
        const oldValue = initState[key];

        if (newValue !== oldValue) {
          register[key](newValue, oldValue, newState);
        }
      }
    });

    initState = newState;
  });
}

module.exports = watcher;