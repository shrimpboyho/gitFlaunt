// Copyright shrimpboyho.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
//


// Require all the stuff needed

var http = require('http');
var fileManager = require('fs');
var pathManager = require('path');


// Create the server

var server = http.createServer();

// Server request event

server.on('request',function(request,response){
    
    // Create data variable
    
    var dataBlock = '';

    // TODO : WORK ON UPLOAD STUFF
    
    request.on('data',function(chunk){
        
        dataBlock = dataBlock + chunk;
        console.log("Recieved Chunk: "+ chunk.toString());
        
    });
    
    // When there is no more data left to read
    
    request.on('end',function(err){      
        
        // End the response if the file uploaded was less that 
        
        console.log("Got a full chunk: %j", JSON.parse(JSON.stringify(dataBlock)));
           
    });
    
    
    // Begin routing
    
    routingSystem('.' + request.url.toString(),request,response);
    
 
});


// Open the server for listening

var port = 3000 || process.env.PORT;

server.listen(port);

// Log to the console

console.log("Server is listening on ports");


/* Routing System Function */

function routingSystem(requestURL, requestInner, responseInner){
      
	
    // Check the api routes before loading any files 	
	
    apiRoutes(requestURL, requestInner, responseInner);
    
    // if a default url is specified load index.html
    
    if (requestURL == './'){

        requestURL = './public/index.html';
        
    }else{

        requestURL = requestURL.substring(1, requestURL.length);
        requestURL = "./public" + requestURL;
    
    }
    // Get the file extension
    
    var extname = pathManager.extname(requestURL);
    
    // Determine what content type to echo based on file extension
    
    var contentType = 'text/html';
    
    switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}

    console.log("Got a request for " + requestURL);
    
    fileManager.exists(requestURL, function(exists) {
        
        if (exists) {
	
            // Read the file
            
            var filetoserve = fileManager.readFileSync(requestURL);
                
			responseInner.writeHead(200, { 'Content-Type': contentType });
			
            // Write the file
            
            responseInner.write(filetoserve);
            
            // Log
            console.log("Served " + requestURL);
            
            // End the response
            
            responseInner.end();
	
        }
        else {
            responseInner.writeHead(404);
            responseInner.end();
        }
    
    });
    
}

/* API ROUTING SYSTEM */

function apiRoutes(requestURL, requestInner, responseInner){

    var apiRegex = /^\.\/api.*/;
    
    if(apiRegex.test(requestURL)){


        responseInner.write("This is the API. Specify more parameters in the URL");
        responseInner.end();
        
    }

}
