  /**
 * Created by zyg on 17/3/4.
 */
const types = require('./types');


module.exports = (socket, isBrowser) => store => next => {

  if(isBrowser){
    socket.on(types.SOCKET_ROUTE,(action)=>{
      next(action);
    });
  }

 return action => {

   console.log(`action:`, action);

   if(action.from === types.BROWSER_TAG){
     //....send to server
     delete action.from;

     socket.emit(types.SOCKET_ROUTE,action);

     return;
   }else if(action.from === types.SERVER_TAG){

     delete action.from;

     return;
   }

   next(action);
 };
}
