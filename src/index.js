var APP_ID = undefined

var http = require('http');

var AlexaSkill = require('./AlexaSkill');

var Consuela = function() {
  AlexaSkill.call(this, APP_ID);
};
// Extending AlexaSkill
Consuela.prototype = Object.create(AlexaSkill.prototype);
Consuela.prototype.constructor = Consuela;

Consuela.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

Consuela.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(response);
};

Consuela.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

Consuela.prototype.intentHandlers = {
  "trainStatus": function(intent, session, response) {
    handletrainsStatusRequest(intent, session, response);
  };
};
