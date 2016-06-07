'use strict';
var hilmatenders = require('./hilmatenders');
module.exports.handler = function(event, context, cb) {
  hilmatenders.handlerequest(event, cb);
};
