'use strict';

/**
 * Created by zyg on 17/3/4.
 */
var actionRedirect = require('./lib/actionRedirect');
var receiveSocket = require('./lib/receiveSocket');
var types = require('./lib/types');

module.exports = {
  actionRedirect: actionRedirect,
  receiveSocket: receiveSocket,
  types: types
};