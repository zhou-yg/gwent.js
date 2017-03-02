import {createStore,combineReducers} from 'redux'
import reducers from './reducers'

const store = createStore(combineReducers({
  value:reducers
}));


export default store
