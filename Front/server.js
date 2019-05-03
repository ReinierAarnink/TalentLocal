// call all the required packages
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var request = require('request');
var WatsonClient = require('./WatsonAPI/WatsonCall');
var ejs = require("ejs");

//Set global variables
var port = 3001;
var mongoAPIURL = 'http://localhost:3002/post'; //for local use

var app = express();
app.use(bodyParser.urlencoded({ extended: true, type: "application/json" }));
app.set('view engine', 'ejs');

// SET STORAGE
var storage = multer.memoryStorage(); // allows extraction of image from requestbody
var upload = multer({ storage: storage }); //sets storage to memory in stead of disk

//Define routes
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Router handling upload of photo
app.post('/upload/photo', upload.single('myImage'), (req, res) => {
    var file = req.file.buffer;
    var fileSize = req.file.size / 1024 / 1024;
    Watsonresponse = undefined;
    Result = new Object;
    
    WatsonClient(file); // Calls WatsonClient with the file from the request

    res.setTimeout(5000, function () {
        if (fileSize >= 10) { //Checks image for maximum allowed size
            res.render('error1')
            res.end();
        }    
        else if (Watsonresponse === undefined) {  //Watson does not recognize the image
            res.render('error2')
            res.end();
        } else {    // Watson has recognized the image
            request.post({  // send result to Mongo-API
                "headers": { "content-type": "application/json" },
                "url": mongoAPIURL, // Use this location
                "body": Watsonresponse // use response from Watson as request
            }, (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                Result = JSON.parse(body); // Result from Mongo-API
                viewVariable1 = Result.Image.class;
                viewVariable2 = Result.Image.score;
                viewVariable3 = Result.Count;
                res.render('result', {Class: viewVariable1, Score: viewVariable2, Count: viewVariable3}); // render JSON in nicer format
            });
        }
    });

});

app.listen(port, () => console.log(('Server started on port %d'), port)); // start defined server