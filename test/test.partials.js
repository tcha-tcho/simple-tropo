var app     = require('express')()
  , request = require('./support/http')
  , tropo    = require('../')({
    ,token : "your token here"
  }).listen(app)


app.set('views',__dirname + '/fixtures');

var fs = require('fs');
app.get('/',function(req,res,next){
  fs.readFile(__dirname.substr(0,__dirname.length - 5) + '/example/views/index.html', 'utf8', function(err, text){
    res.send(text);
  });
});

// override the default error handler so it doesn't log to console:
app.use(function(err,req,res,next) {
  console.log(err.stack);
})



describe('app',function(){

  describe('GET /',function(){
    it('should render with default stuff',function(done){
      request(app)
        .get('/')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.include('<html>');
          res.body.should.include('</form>');
          done();
        })
    })
  })
  describe('POST /',function(){
    it('should create a new message on POST /',function(done){
      request(app)
        .post('/',
        {number:"some-number"}
        ,function(res){
          res.should.include('message delivered');
          done();
        })
    })
  })

})
