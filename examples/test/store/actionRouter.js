/**
 * Created by zyg on 17/3/2.
 */
module.exports = (socket) => (store) => (next) => action => {

  console.log(action);

  if(action.from === 'browser'){
    //....send to server
    delete action.from;

    socket.emit(action.type,action);

    return;
  }else if(action.from === 'server'){

    delete action.from;

    console.log('actionRouter');

    return new Promise((resolve)=>{

      socket.emit(action.type,action);

      resolve();
    });
  }


  return next(action);
};