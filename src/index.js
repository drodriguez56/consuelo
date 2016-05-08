var APP_ID = "amzn1.echo-sdk-ams.app.2c0a5ffa-2eb3-423d-8a17-2cb38c7c3428"; 

var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
var data = {};
var http = require("http");

var AlexaSkill = require("./AlexaSkill");

var Consuela = function() {
  AlexaSkill.call(this, APP_ID);
};
// Extending AlexaSkill
Consuela.prototype = Object.create(AlexaSkill.prototype);
Consuela.prototype.constructor = Consuela;

Consuela.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
};

Consuela.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(response);
};

Consuela.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
};

Consuela.prototype.intentHandlers = {
  "TrainStatus": function(intent, session, response) {
    handleTrainStatusRequest(intent, session, response);
  },
  "TrainTimes": function(intent, session, response) {
    handleTrainTimeRequest(intent, session, response);
  },
  "AMAZON.HelpIntent": function(intent, session, response) {
    handleHelpRequest(response);
  }
};

function handleHelpRequest(response) {
  var repromptText = "what train do you whant me to check?";
  var speechOutput = "I can Help you looking for train times, "+ "or train status. " + repromptText;
  response.ask(speechOutput, repromptText);
};
function handleWelcomeRequest(response) {
  var speechOutput = "test";
  var repromptText = "moretest";
  
  response.ask(speechOutput, repromptText);
};
var STATIONS={
  'Whitlock': '612N',
  'canal': '135N',
  'spring': '638S'
};
function handleTrainTimeRequest(intent, session, response) {
  var speechOutput;
 var innerResponse = response; 
   var stationSlot = intent.slots.Station;
   var endpoint = 'http://datamine.mta.info/mta_esi.php?key=f4958b338ff06e6f90047282ac09b812&feed_id=1';
  var requestSettings = {
    method: 'GET',
    url: endpoint, 
    encoding: null
  };
  request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
      data = feed
      console.log(STATIONS[stationSlot.value]);
      var station = STATIONS[stationSlot.value];
      console.log(station)
      var times = parseData(station);
      times[times.length -1] = "and " + times[times.length - 1]
      var trainTimes = times.join(", ");
      speechOutput = "The next train arrival times are in: " + trainTimes + " minutes."
      innerResponse.tellWithCard(speechOutput, "Consuela", speechOutput)
    }
  });
         
};

function parseData (station) {
 var updates = data.entity.map(function(ent) { if (ent.trip_update) { return ent.trip_update.stop_time_update } });
	var merged = [].concat.apply([], updates);
	var trains =  merged.filter(function(ele) { if (ele) return ele.stop_id === station } )
	return trains.map(function(car) { return Math.round((new Date(1000 * car.arrival.time.low) - Date.now())/1000/60) } )
}

function handleTrainStatusRequest(intent, session, response) {
  var speechOutput;

  speechOutput = "your train is dalay. sorry.. fuck you";

  response.tellWithCard(speechOutput, "Consuela", speechOutput);
};


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var consuela = new Consuela();
    consuela.execute(event, context);
};
