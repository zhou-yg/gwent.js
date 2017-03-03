/**
 * Created by zyg on 17/3/2.
 */
module.exports = (socket) => (store) => (next) => action => {

  console.log(action);

  if(action.from === 'browser'){
    //....send to server

    socket.emit(action.type,JSON.stringify(action));
    

    return
  }


  return next(action);
}