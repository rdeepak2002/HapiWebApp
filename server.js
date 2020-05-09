var express = require('express')
var request = require('request')
var async = require("async");
var bodyParser = require('body-parser')
// var NLP = require('stanford-corenlp');
// var config = {"nlpPath":"./corenlp","version":"3.6.0"};
// var coreNLP = new NLP.StanfordNLP(config);

var app = express();
app.use(bodyParser.json())

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/Register', function(req, res) {
	res.sendFile('public/Register/Register.html', {"root": __dirname});
});

app.get('/Home', function(req, res) {
	res.sendFile('public/Home/Home.html', {"root": __dirname});
});


app.get('/People', function(req, res) {
  res.sendFile('public/People/People.html', {"root": __dirname});
});


app.get('/Dashboard', function(req, res) {
	res.sendFile('public/Dashboard/Dashboard.html', {"root": __dirname});
});

app.get('/Relax', function(req, res) {
  res.sendFile('public/Relax/Relax.html', {"root": __dirname});
});

app.get('/Settings', function(req, res) {
  res.sendFile('public/Settings/Settings.html', {"root": __dirname});
});

app.post('/Parse', function(req, res) {
      var postData = JSON.stringify(req.body);
      //console.log(postData);

      while(postData.indexOf("\n") != -1) {
        postData.replace('\n','');
      }
      
      const url = 'https://gateway.watsonplatform.net' + '/natural-language-understanding/api/v1/analyze?version=2018-03-16';
      const usernameIn = "eee08984-54ad-4411-85f4-dd86ad22bba8";
      const passwordIn = "HJiivTFZRCqL";

      const auth = "Basic " + new Buffer.from(usernameIn + ":" + passwordIn).toString("base64");
      
      var nluData = {
        'text': postData,
        'features': {
          "entities": {
            "emotion": true,
            "sentiment": true,
            "limit": 50
          },
          'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 249
          }
          
        }
      }

      const options = {
          url : url,
          body: JSON.stringify(nluData),
          headers : {
              "content-type" : "application/json",
              "Authorization" : auth
          }
      };
      
      request.post(options, function(error, response, body) {
          var resultArray = [4];
          var entityResultArray = [3];
          var finalResult = "{\"tokens\":[";
          var resultJSON;
          var doSubstring = false;
          //console.log("body: " + body + " \nend of body");
          if(JSON.parse(body).keywords != undefined) {
            for (var i = 0; i < JSON.parse(body).keywords.length; i++) {
              resultArray[0] = JSON.stringify(JSON.parse(body).keywords[i].text);
              resultArray[1] = JSON.stringify(JSON.parse(body).keywords[i].sentiment.score);
              resultArray[2] = JSON.stringify(JSON.parse(body).keywords[i].relevance);
              resultArray[3] = JSON.stringify(JSON.parse(body).keywords[i].emotion);

              if(resultArray[1] != 0 && resultArray[0]!="\"text\"" && resultArray[0] != undefined && resultArray[1] != undefined &&resultArray[2] != undefined &&resultArray[3] != undefined) {

                resultJSON = '{ \"text\": ' + resultArray[0] + ', \"sentiment\": ' + resultArray[1] + ', \"relevance\": ' + resultArray[2] + ', \"emotion\": ' + resultArray[3]  + '},';
                doSubstring = true;
                finalResult += resultJSON;
                //console.log("object: " + resultArray[0] + ", sentiment: " + resultArray[1] + ", relevance: " + resultArray[2]);
              }
            }
            if(doSubstring)
              finalResult = finalResult.substring(0, finalResult.length-1);

            finalResult += "], \"entities\":[";

            if(JSON.parse(body).entities != undefined)
            {
              for(var i = 0; i < JSON.parse(body).entities.length; i++) {
                entityResultArray[0] = JSON.stringify(JSON.parse(body).entities[i].text);
                entityResultArray[1] = JSON.stringify(JSON.parse(body).entities[i].sentiment);
                entityResultArray[2] = JSON.stringify(JSON.parse(body).entities[i].emotion);
                entityResultArray[3] = JSON.stringify(JSON.parse(body).entities[i].type);

                if(entityResultArray[1] != 0 && entityResultArray[3] != undefined && entityResultArray[3]=="\"Person\"") {
                  //if(i == JSON.parse(body).entities.length-1)
                  //  finalResult += '{ \"text\": ' + entityResultArray[0] + ', \"sentiment\": ' + entityResultArray[1] + ', \"emotion\": ' + entityResultArray[2] + ', \"type\": ' + entityResultArray[3] + '}';
                  //else
                    finalResult += '{ \"text\": ' + entityResultArray[0] + ', \"sentiment\": ' + entityResultArray[1] + ', \"emotion\": ' + entityResultArray[2] + ', \"type\": ' + entityResultArray[3] + '}' + ",";
                }
              }
              if(finalResult.charAt(finalResult.length-1)==',')
                finalResult = finalResult.substring(0, finalResult.length-1);
            }

            finalResult += "]}";

            res.send(JSON.parse(finalResult)); 
          }
          else {
           res.send(JSON.parse("{\"tokens\":[], \"entities\":[]}"));
          }
      });
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
	res.sendFile('public/404.html', {"root": __dirname});
});

app.listen(port, function() {
	console.log('Deepak\'s server running...')
});



// app.post('/Analyze', function(req, res) {
//     const postData = JSON.stringify(req.body);

//     // console.log(postData);
    
//     const url = 'https://gateway.watsonplatform.net' + '/tone-analyzer/api/v3/tone?version=2017-09-21';
//     const usernameIn = "277cdc6d-3665-4483-abc8-718bf2553661";
//     const passwordIn = "aG1JKenoVimd";
    
//     const auth = "Basic " + new Buffer.from(usernameIn + ":" + passwordIn).toString("base64");
    
//     const options = {
//         url : url,
//         body: postData,
//         headers : {
//          "content-type" : "application/json",
//             "Authorization" : auth
//         }
//     };
    
//     request.post(options, function(error, response, body) {
//         res.send(body);
//     });
// });

// app.post('/NLU', function(req, res) {
//     const postData = JSON.stringify(req.body);

//     // console.log(postData);
    
//     const url = 'https://gateway.watsonplatform.net' + '/natural-language-understanding/api/v1/analyze?version=2017-02-27';
//     const usernameIn = "eee08984-54ad-4411-85f4-dd86ad22bba8";
//     const passwordIn = "HJiivTFZRCqL";

//     const auth = "Basic " + new Buffer.from(usernameIn + ":" + passwordIn).toString("base64");
    
//     const options = {
//         url : url,
//         body: postData,
//         headers : {
//             "content-type" : "application/json",
//             "Authorization" : auth
//         }
//     };
    
//     request.post(options, function(error, response, body) {
//         res.send(body);
//     });
// });
