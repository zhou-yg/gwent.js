/**
 * Created by zyg on 17/3/4.
 */
const types = require('./types');


module.exports = (socket) => store => next =>{



  socket.on(types.SOCKET_ROUTE,(action)=>{
    console.log('接收:',action);

    next(action);
  });

 return action =>{

   next(action);
 };
}