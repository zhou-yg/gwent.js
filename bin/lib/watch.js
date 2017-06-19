'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

//@TODO 淘汰啦
function watcher(store, register) {

  var initState = store.getState();

  if ((0, _keys2.default)(register).every(function (fnName) {
    return typeof register[fnName] !== 'function';
  })) {
    throw new Error('callback must be function');
  }

  return store.subscribe(function () {

    var newState = store.getState();

    (0, _keys2.default)(newState).map(function (key) {
      if (register[key]) {
        var newValue = newState[key];
        var oldValue = initState[key];

        if (newValue !== oldValue) {
          register[key](newValue, oldValue, newState);
        }
      }
    });

    initState = newState;
  });
}

function mapState() {}

module.exports = watcher;