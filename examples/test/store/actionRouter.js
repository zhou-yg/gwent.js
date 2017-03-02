/**
 * Created by zyg on 17/3/2.
 */
export default actionRouter = ({dispatch,getStore}) => next => action {

  if(action.browser){
    //....send to server
  }
  return next(action);
}