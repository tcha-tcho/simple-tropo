var express = require('express')
  , app = express()
  , tropo = require('../')({
    // token : "your-token"
  }).listen(app)

var port = parseInt(process.env.PORT) || 8080;
app.use(express.bodyParser());

var fs = require('fs');
app.get('/',function(req,res,next){
  fs.readFile(__dirname + '/views/index.html', 'utf8', function(err, text){
    res.send(text);
  });
});

tropo.listener = function(res,tropo_obj){
  //intercepting listener to create interactive app
  console.log(tropo_obj)
  res.send(tropo_obj);
}
app.post('/',function(req,res,next){
  console.log(req.body)
  tropo.send(req.body,function(){
    res.redirect("/")
  })
});

app.listen(port);
console.log('Express server listening on port %d, environment: %s, express:', port, app.settings.env, express.version)
