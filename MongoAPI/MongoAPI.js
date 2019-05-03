var Request = require("request-promise");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoURL = "http://localhost:3003/api/Images"; // host:port/restApiRoot from config.json (TalentImageRecognitionLocal/Mongo-Server/ServerMongoFoto/server/)
var Port = 3002; // listening port

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function MaakderWatMooisVan(ObjectMongoCount, Class, error) {
    if (error) {
        return console.dir(error);
    }
    var jsondata = JSON.parse(ObjectMongoCount);
    newBody = jsondata.filter(function (o) {
        return (o.class === Class)          //  filters arrays for elements within the current class
    })
    Response.Count = newBody.length;    // Adds the length of the filtered array to the response object
}
//kijken of het werkt
async function Controller(Obj, Class, res) {
    let Inputresult = await Request.post({ // posts the current Watson Answer to the MongoDB
        "headers": { "content-type": "application/json" },
        "url": mongoURL,
        "body": JSON.stringify(Obj)
    }, (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        Response.Image = JSON.parse(body); // Adds current Watson answer to the Response object
    })

    let CountObject = await Request.get(mongoURL); // Async function, performs a GET on the MongoDB to pull data to parse for the provided class.
    await MaakderWatMooisVan(CountObject, Class); //Parses the database for the current class and enumerates the amount of elements.
    await res.send(JSON.stringify(Response)); // 
}

app.post('/post', function (req, res) { //Server that listenes for POST requests on the /post endpoint
    var mongo = req.body;
    var mongoclass = req.body.class
    Response = new Object;
    Response.Image = Object;
    Response.Count = Number;
    Response = Controller(mongo, mongoclass, res); // calls Async function to reduce callback hell
});

app.listen(Port, function () {
    console.log('Mongo-API is listening for requests from Front on (http://localhost:%d/post)', Port);
});
