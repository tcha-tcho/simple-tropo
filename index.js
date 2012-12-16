var querystring = require('querystring');
var crypto      = require('crypto');
var http        = require('http');
var url_parser  = require("url");
var tropowebapi = require('tropo-webapi');
var _tropo      = new tropowebapi.TropoWebAPI();


module.exports = function(options) {

  var errors = [];
  var token  = options.token;
  var url    = (options.url    || "api.tropo.com");

  if (errors.length > 0) throw errors; //simple-tropo errors

  //private functions
  function body_parser(req,callback){
    var body = '';
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      callback(JSON.parse(body));
    });
  }

  //public methods
  return {
    send: function(data,callback) {
      data.token = (data.token || token);
      data = querystring.stringify(data);
      var path = '/1.0/sessions?action=create&'+data;
      var tropo_session_api = http.createClient(80, url);
      var request = tropo_session_api.request('GET', path, {'host': url});

      request.end();
      if (callback != undefined) callback();
    },
    trigger: function(data,callback) {
      this.send(data,callback)
    },
    listener: function(res,tropo_obj) {
      res.send(tropo_obj);
    },
    listen: function (app, options) {
      var self = this;
      app.use(function(req,res,next){
        if (req._parsedUrl.pathname == '/simple_tropo.json') {
          body_parser(req,function(data){

            var parameters;
            if (data && data.session) parameters = data['session']['parameters'];

            if(parameters) {
              var say = parameters.say?new Say(parameters.say):null;
              var type = (parameters.type || "message")
              if (type == "message") {
                _tropo.message(
                   say
                  ,(parameters.to            || null)
                  ,(parameters.answerOnMedia || null)
                  ,(parameters.channel       || null)
                  ,(parameters.from          || null)
                  ,(parameters.name          || null)
                  ,(parameters.network       || "SMS")
                  ,(parameters.required      || null)
                  ,(parameters.timeout       || null)
                  ,(parameters.voice         || null)
                );
              } else if (type == "ask") {
                _tropo.ask(
                   say
                  ,(parameters.choices       || null)
                  ,(parameters.attempts      || null)
                  ,(parameters.bargein       || null)
                  ,(parameters.minConfidence || null)
                  ,(parameters.name          || null)
                  ,(parameters.recognizer    || null)
                  ,(parameters.required      || null)
                  ,(parameters.timeout       || null)
                  ,(parameters.voice         || null)
                );
              } else if (type == "call") {
                _tropo.call(
                   say
                  ,(parameters.callerID      || null)
                  ,(parameters.answerOnMedia || null)
                  ,(parameters.channel       || null)
                  ,(parameters.from          || null)
                  ,(parameters.headers       || null)
                  ,(parameters.name          || null)
                  ,(parameters.network       || "PSTN")
                  ,(parameters.recording     || null)
                  ,(parameters.required      || null)
                  ,(parameters.timeout       || null)
                );
              } else if (type == "conference") {
                _tropo.conference(
                   (parameters.id            || null)
                  ,(parameters.mute          || null)
                  ,(parameters.name          || null)
                  ,(parameters.playTones     || null)
                  ,(parameters.required      || null)
                  ,(parameters.terminator    || null)
                );
              } else if (type == "record") {
                _tropo.record(
                   say
                  ,(parameters.attempts      || null)
                  ,(parameters.bargein       || null)
                  ,(parameters.beep          || null)
                  ,(parameters.choices       || null)
                  ,(parameters.format        || null)
                  ,(parameters.maxSilence    || null)
                  ,(parameters.maxTime       || null)
                  ,(parameters.method        || null)
                  ,(parameters.minConfidence || null)
                  ,(parameters.name          || null)
                  ,(parameters.required      || null)
                  ,(parameters.timeout       || null)
                  ,(parameters.transcription || null)
                  ,(parameters.url           || null)
                  ,(parameters.password      || null)
                  ,(parameters.username      || null)
                );
              } else if (type == "redirect") {
                _tropo.redirect(
                   (parameters.to            || null)
                  ,(parameters.name          || null)
                  ,(parameters.required      || null)
                );
              } else if (type == "say") {
                _tropo.say(
                   (parameters.value         || null)
                  ,(parameters.as            || null)
                  ,(parameters.name          || null)
                  ,(parameters.required      || null)
                  ,(parameters.voice         || null)
                );
              } else if (type == "startRecording") {
                _tropo.startRecording(
                   (parameters.format        || null)
                  ,(parameters.method        || null)
                  ,(parameters.url           || null)
                  ,(parameters.username      || null)
                  ,(parameters.password      || null)
                );
              } else if (type == "stopRecording") {
                _tropo.stopRecording();
              } else if (type == "transfer") {
                _tropo.transfer(
                   (parameters.to            || null)
                  ,(parameters.answerOnMedia || null)
                  ,(parameters.choices       || null)
                  ,(parameters.from          || null)
                  ,(parameters.headers       || null)
                  ,(parameters.name          || null)
                  ,(parameters.on            || null)
                  ,(parameters.required      || null)
                  ,(parameters.terminator    || null)
                  ,(parameters.timeout       || null)
                );
              };
              // tropo.on("continue", null, "/call", true);
              // tropo.on("hangup", null, "/call", true);
              _tropo.type = type;
              var tropo_obj = JSON.parse(tropowebapi.TropoJSON(_tropo));
              tropo_obj["tropo"] = [tropo_obj["tropo"][0]]; //Duplicating messages
              self.listener(res,tropo_obj)
            } else {
              res.send(200);
            }

          })
        } else {
          next();
        };
      })
      return this
    }

  }
}
