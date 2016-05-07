var APP_ID = undefined

var http = require('http');

var AlexaSkill = require('./AlexaSkill');

var Consuela = function() {
  AlexaSkill.call(this, APP_ID);
};
