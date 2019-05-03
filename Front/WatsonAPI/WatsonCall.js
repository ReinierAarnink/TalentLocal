WatsonClient = function WatsonClient(file = './klok.jpg', thresholdvalue = 0.7, me = 'me') {

  // WatsonClient handles the requests from Front and passes the image via http to Watson

  const fs = require('fs');   // For demo
  const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3'); //WatsonAPI
  var classifier_ids = ["VR_V3_786148410"]; // Demo Model ID

  if (file === String) // for demo purposes, uses local file when no file is found.
    var classifyParams = { 
      images_file: fs.createReadStream(file), //hardcoded file for demo
      owners: [me],
      classifier_ids: classifier_ids, // defines model to be used
      threshold: thresholdvalue, 
    };

  else (file === Buffer) // uses buffer from request body 
  var classifyParams = {
    images_file: file, //takes the image from buffer
    owners: [me],
    classifier_ids: classifier_ids, // defines model to be used
    threshold: thresholdvalue,
  };
// authorization
  var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'ASl2gKOWPzaho3RUYyoUn3lq_8RWb6axcfYhLtL8HHjY',
  })

// Send Request to Watson using ClassifyParams
  visualRecognition.classify(classifyParams) 
    .then(classifiedImages => {
      Watsonresponse = JSON.stringify(classifiedImages.images[0].classifiers[0].classes[0], null, 2); // parses response from Watson to extract useful data to be stored in MongoDB
    })
    .catch(err => {
      console.log('error:', err);
    });
}

module.exports = WatsonClient