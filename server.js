var express = require('express');

var app = express();

app.get('/',function(request,response){
	
    response.sendfile(__dirname+ "/public/index.html");

});

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({
    dumpExceptions: true, 
    showStack: true
  }));
  app.use(app.router);
});

app.listen(3000);
console.log('Listening on port 3000');
