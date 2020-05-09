(function() {
    var getUrl = window.location;
    var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    var guestusername = '';
    var hideable = document.getElementById("hide");
    hideable.style.display = "none";

    baseUrl = "http://hapidiary.com";

    // Check session storage
    if(sessionStorage.getItem("username") == null || sessionStorage.getItem("password") == null) {
        removeItems();
        window.top.location.href = "/Register";
    }

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCUiSG2mg9wf36iaa851V9ENsqoudU2JpA",
        authDomain: "hapi-99baf.firebaseapp.com",
        databaseURL: "https://hapi-99baf.firebaseio.com",
        projectId: "hapi-99baf",
        storageBucket: "hapi-99baf.appspot.com",
        messagingSenderId: "506107083575"
    };
    firebase.initializeApp(config);
    var firestore = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    firestore.settings(settings);

    // Check if credentials work
    var userRef = firestore.collection('users').doc(String(sessionStorage.getItem("username")));
    var username = String(sessionStorage.getItem("username"));
    var pass = String(sessionStorage.getItem("password"));

    var getDoc = userRef.get()
        .then(function(doc) {
            if (!doc.exists) {
                console.log("redirect now");
                window.top.location.href = "/Register";
            }
            else {
                var usernameC = doc.data().username;
                var passwordC = doc.data().password;
                if(username == usernameC && pass == passwordC) {
                    if (hideable.style.display === "none") {
                        hideable.style.display = "block";
                    }
                    console.log("stay on page");
                }
                else {
                    console.log("redirect now");
                    window.top.location.href = "/Register";                
                }
            }
        })
        .catch(function(error) {
            console.log('Error getting document', err);
        });

    //stopLoader();


            // Observing user
    var doc = firestore.collection('users').doc(username);
    var observer = doc.onSnapshot(function(docSnapshot) {
        var pColor = docSnapshot.data().pColor;
        var sColor = docSnapshot.data().sColor;
        var bgImg = docSnapshot.data().bgImg;
        var profileImg = docSnapshot.data().profileImg;

        if(pColor != undefined) {
            $(".profile-header-img > img.img-circle").css("border", "2px solid "+pColor+"");
            $(".label.label-default.rank-label").css("background-color", pColor);
        }

        if(sColor != undefined) {
            $("li").css("color", sColor);
        }

        if(bgImg != undefined && bgImg != '' && bgImg != 'Blank' && bgImg != 'Blank Image') {
            $("#bgImageB").attr('src',bgImg);
        }
        else {
            $("#bgImageB").attr('src',"https://assets.awwwards.com/assets/images/nophoto.png");
        }

        if(profileImg != undefined && (checkURL(profileImg) || profileImg.indexOf("firebase")!=-1) && profileImg != 'https://images-na.ssl-images-amazon.com/images/I/31yKg%2B0tevL._SX425_.jpg' && profileImg != 'Default') {
            $(".img-circle").attr("src",profileImg);
        }
        else {
            $(".img-circle").attr("src","https://images-na.ssl-images-amazon.com/images/I/31yKg%2B0tevL._SX425_.jpg");
        }

        if (hideable.style.display === "none") {
            hideable.style.display = "block";
        }
    }, function(err) {
        console.log(`Encountered error: ${err}`);
    });
    

    // Get elements
    const btnLogout = document.getElementById('btnLogout');
    const btnPost = document.getElementById('postButton');
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    //const happinessElement = document.getElementById('happiness');

    // Observing user
    var doc = firestore.collection('users').doc(username);
    var observer = doc.onSnapshot(function(docSnapshot) {
        usernameElement.innerText = docSnapshot.data().username;
        //emailElement.innerText = docSnapshot.data().email;
        //happinessElement.innerText = docSnapshot.data().happiness;
    }, function(err) {
        console.log(`Encountered error: ${err}`);
        location.reload();
    });

    var classNames = [];
    var analysisObjects = [];
    var values = [];
    var overallAnalysisObjects = [];
    var overallValues = [];
    var overallSentiments = [];
    var overallIndex = 0;
    var count = 0;
    var collapseId = 0;
    var avgSentiment = 0;
    var docCount = 0;
    var tokenCount = 0;

    // Observing entries
    var collectionReference = firestore.collection('users/'+username+'/journalEntries');
    var query = collectionReference.where('username', '==', username).orderBy('dateObj','desc');
    var entryObserver = collectionReference.onSnapshot(function(docSnapshot) {
        // Remove all previous entries
        $('.comment').remove();

        query.get().then(function(querySnapshot) {
            if (querySnapshot.size > 0) {
                // go through all the results
                querySnapshot.forEach(function (documentSnapshot) {
                    docCount++;
                    var appendable = true;
                    var data = documentSnapshot.data();
                    if(data.nluAnalysis.tokens.length<=0)
                        appendable = false;
                    var dashboardObj = $('<div class="dashboard"></div>');
                    var comment = $('<div class="comment"></div>');
                    var contents = $('<div class="body" ></div>');
                    var innerContents = $('<div class="collapse" id = "collapseExample'+collapseId+'"></div>');
                    $('<a style="float: right;" onclick="if(this.innerHTML==\'View\') this.innerHTML=\'Close\'; else this.innerHTML=\'View\';" type="button" data-toggle="collapse" data-target="#collapseExample'+collapseId+'" aria-expanded="true" aria-controls="collapseExample">View</a>').appendTo(contents);
                    $('<p>' + data.title +  ' • ' + data.date + '</p>').appendTo(contents);
                    //$('<span> • ' + data.date + '</span><br /><br />').appendTo(contents);
                    //$('<p>' + data.entry + '</p>').appendTo(innerContents);
                    for(var i = 0; i < data.nluAnalysis.tokens.length; i++) {
                        //if(Number(data.nluAnalysis.tokens[i].sentiment) != 0) {
                            tokenCount++;

                            var sentiment = parseInt(Number(data.nluAnalysis.tokens[i].sentiment)*10);

                            avgSentiment += Number(data.nluAnalysis.tokens[i].sentiment);

                            var analysisObject = titleCase(JSON.stringify(data.nluAnalysis.tokens[i].text).substring(1,JSON.stringify(data.nluAnalysis.tokens[i].text).length-1));

                            //console.log("index of " + analysisObject + ": " +  analysisObjects.indexOf(analysisObject));
                            //console.log("in " + analysisObjects.toString());

                            if(overallAnalysisObjects.indexOf(analysisObject)==-1){
                                overallAnalysisObjects.push(analysisObject);

                                overallValues.push({
                                    anger   : parseFloat(data.nluAnalysis.tokens[i].emotion.anger), 
                                    disgust : parseFloat(data.nluAnalysis.tokens[i].emotion.disgust), 
                                    fear    : parseFloat(data.nluAnalysis.tokens[i].emotion.fear), 
                                    joy     : parseFloat(data.nluAnalysis.tokens[i].emotion.joy), 
                                    sadness : parseFloat(data.nluAnalysis.tokens[i].emotion.sadness)
                                });

                                overallSentiments.push(sentiment);

                                overallIndex++;
                            }
                            else {
                                var index = overallAnalysisObjects.indexOf(analysisObject);
                                overallValues[index].anger = (overallValues[index].anger+data.nluAnalysis.tokens[i].emotion.anger)/2;
                                overallValues[index].disgust = (overallValues[index].disgust+data.nluAnalysis.tokens[i].emotion.disgust)/2;
                                overallValues[index].fear = (overallValues[index].fear+data.nluAnalysis.tokens[i].emotion.fear)/2;
                                overallValues[index].joy = (overallValues[index].joy+data.nluAnalysis.tokens[i].emotion.joy)/2;
                                overallValues[index].sadness = (overallValues[index].sadness+data.nluAnalysis.tokens[i].emotion.sadness)/2;
                                overallSentiments[index]= (overallSentiments[index]+data.nluAnalysis.tokens[i].sentiment)/2;
                                //console.log("Combined " + analysisObject);
                            }

                            // if duplicate, combine data
                            if(analysisObjects.indexOf(analysisObject)==-1){
                                $( ".removeThis" ).remove();

                                if(sentiment != 0) {
                                    if(sentiment < -0.9)
                                        //$('<p style="color:red">' + JSON.stringify(data.nluAnalysis.tokens[i].text) + " : " + sentiment + '</p>').appendTo(innerContents);
                                        $('<div class="center"><p style="color:red; font-size: 30px;">' + analysisObject + '</p></div>').appendTo(innerContents);
                                    else if(sentiment > 0.9)
                                        $('<div class="center"><p style="color:green; font-size: 30px;">' + analysisObject + '</p></div>').appendTo(innerContents);
                                    else
                                        $('<div class="center"><p style="color:orange; font-size: 30px;">' + analysisObject + '</p></div>').appendTo(innerContents);

                                    if(sentiment > 5)
                                        $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface5.png?alt=media&token=97972b1f-d22a-4fbb-a7c1-8b96aa98ad62" alt="Emotion" width="50" height="50">').appendTo(innerContents);
                                    else if(sentiment > 1)
                                        $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface4.png?alt=media&token=1bddb6f6-6894-4625-ae54-ae1a80e208fa" alt="Emotion" width="50" height="50">').appendTo(innerContents);
                                    else if(sentiment > -1)
                                        $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface3.png?alt=media&token=fecb395f-bbfc-43c9-a779-ccd0f5caa9a4" alt="Emotion" width="50" height="50">').appendTo(innerContents);
                                    else if(sentiment > -5)
                                        $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface2.png?alt=media&token=dfbe6d04-76d8-41f0-b3fb-6427bedcc52b" alt="Emotion" width="50" height="50">').appendTo(innerContents);
                                    else
                                        $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface1.png?alt=media&token=908a6e07-9e30-4a13-9095-c9729d477086" alt="Emotion" width="50" height="50">').appendTo(innerContents);

                                    $('<div id="radarChart" class="radarChart' + count + '"></div>').appendTo(innerContents);                                
                                }

                                classNames.push(".radarChart" + count);
                                analysisObjects.push(analysisObject);

                                values.push({
                                    anger   : parseFloat(data.nluAnalysis.tokens[i].emotion.anger), 
                                    disgust : parseFloat(data.nluAnalysis.tokens[i].emotion.disgust), 
                                    fear    : parseFloat(data.nluAnalysis.tokens[i].emotion.fear), 
                                    joy     : parseFloat(data.nluAnalysis.tokens[i].emotion.joy), 
                                    sadness : parseFloat(data.nluAnalysis.tokens[i].emotion.sadness)
                                });

                                count++;
                            }
                            else {
                                var index = analysisObjects.indexOf(analysisObject);
                                values[index].anger = (values[index].anger+data.nluAnalysis.tokens[i].emotion.anger)/2;
                                values[index].disgust = (values[index].disgust+data.nluAnalysis.tokens[i].emotion.disgust)/2;
                                values[index].fear = (values[index].fear+data.nluAnalysis.tokens[i].emotion.fear)/2;
                                values[index].joy = (values[index].joy+data.nluAnalysis.tokens[i].emotion.joy)/2;
                                values[index].sadness = (values[index].sadness+data.nluAnalysis.tokens[i].emotion.sadness)/2;
                                //console.log("Combined " + analysisObject);
                            }
                        //}
                    }
                    console.log(analysisObjects.toString());

                    analysisObjects = [];

                    if(docCount == querySnapshot.size) {
                        var maxEmo = "";
                        console.log(overallAnalysisObjects.toString());
                        var tableElements = [];

                        for(var i = 0; i < overallAnalysisObjects.length; i++) {
                            var dashboard = $('<div class="dataElement"></div>');
                            var joyList = $('<div class="dataElement"></div>');
                            var sadnessList = $('<div class="dataElement"></div>');
                            var angerList = $('<div class="dataElement"></div>');
                            var disgustList = $('<div class="dataElement"></div>');
                            var fearList = $('<div class="dataElement"></div>');


                            var emotionThreshold = 0.4;
                            var justJoy = true;
                            sentiment = overallSentiments[i];
                            analysisObject = overallAnalysisObjects[i];

                            console.log(JSON.stringify(overallValues[i]));

                            analysisObject += " :"

                            if(overallValues[i].anger > emotionThreshold || overallValues[i].disgust > emotionThreshold || overallValues[i].fear > emotionThreshold || overallValues[i].sadness > emotionThreshold) {
                                justJoy = false;
                            }

                            if(overallValues[i].anger > emotionThreshold || overallValues[i].disgust > emotionThreshold || overallValues[i].fear > emotionThreshold || overallValues[i].joy > emotionThreshold || overallValues[i].sadness > emotionThreshold) {
                                if(overallValues[i].anger > emotionThreshold)
                                    analysisObject += " Anger •";

                                if(overallValues[i].disgust > emotionThreshold)
                                    analysisObject += " Disgust •";

                                if(overallValues[i].fear > emotionThreshold)
                                    analysisObject += " Fear •";

                                if(overallValues[i].joy > emotionThreshold)
                                    analysisObject += " Joy •";

                                if(overallValues[i].sadness > emotionThreshold)
                                    analysisObject += " Sadness";
                            }
                            else {
                                var emoArray = [overallValues[i].anger, overallValues[i].disgust, overallValues[i].fear, overallValues[i].joy, overallValues[i].sadness];
                                var indexOfMaxEmo = indexOfMax(emoArray);

                                if(indexOfMaxEmo == 0)
                                    maxEmo = " Anger";
                                else if (indexOfMaxEmo == 1)
                                    maxEmo = " Disgust";
                                else if (indexOfMaxEmo == 2)
                                    maxEmo = " Fear";
                                else if (indexOfMaxEmo == 3)
                                    maxEmo = " Joy";
                                else if (indexOfMaxEmo == 4)
                                    maxEmo = " Sadness";
                                else
                                    maxEmo = " Error!";

                                analysisObject += " " + maxEmo;// + sentiment;
                            }

                            if(analysisObject.charAt(analysisObject.length-1)=='•')
                                analysisObject = analysisObject.substring(0, analysisObject.length-1);

                            if(sentiment != 0) {
                                $('<div class="center"><a href="#" data-toggle="popover" title="header" data-content="content" style="color:black; font-size: 30px;">' + analysisObject + '</a></div>').appendTo(dashboard);


                                if(sentiment > 5)
                                    $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface5.png?alt=media&token=97972b1f-d22a-4fbb-a7c1-8b96aa98ad62" alt="Emotion" width="50" height="50">').appendTo(dashboard);
                                else if(sentiment > 1)
                                    $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface4.png?alt=media&token=1bddb6f6-6894-4625-ae54-ae1a80e208fa" alt="Emotion" width="50" height="50">').appendTo(dashboard);
                                else if(sentiment > -1)
                                    $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface3.png?alt=media&token=fecb395f-bbfc-43c9-a779-ccd0f5caa9a4" alt="Emotion" width="50" height="50">').appendTo(dashboard);
                                else if(sentiment > -5)
                                    $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface2.png?alt=media&token=dfbe6d04-76d8-41f0-b3fb-6427bedcc52b" alt="Emotion" width="50" height="50">').appendTo(dashboard);
                                else
                                    $('<img class="emotionFace" src="https://firebasestorage.googleapis.com/v0/b/hapi-99baf.appspot.com/o/faces%2Fface1.png?alt=media&token=908a6e07-9e30-4a13-9095-c9729d477086" alt="Emotion" width="50" height="50">').appendTo(dashboard);
                            }

                            tableElements.push(dashboard.prop('outerHTML'));


                        }

                        for(var i = 0; i < tableElements.length; i+=3) {
                            var markup = "";
                            var tableHeight = 100;
                            var tableWidth = 1000;

                            if (i+2 < tableElements.length) {
                                markup = "<tr><td>" + tableElements[i] + "</td><td>" + tableElements[i+1] + "</td><td>" + tableElements[i+2] + "</td></tr>";
                            }
                            else if (i+1 < tableElements.length) {
                                markup = "<tr><td>" + tableElements[i] + "</td><td>" + tableElements[i+1] + "</td></tr>";
                            }
                            else {
                                markup = "<tr><td>" + tableElements[i] + "</td></tr>";
                            }
                            
                            $("table tbody").append(markup);

                            //dashboard.appendTo(dashboardObj);
                        }

                        stopLoader();

                        console.log(avgSentiment);
                    }

                    collapseId++;

                    innerContents.collapse("hide");

                    if(appendable) {
                        innerContents.appendTo(contents);
                        contents.appendTo(comment);
                        comment.appendTo('.comments .inner');
                    }

                    //dashboardObj.appendTo('.overallStatsContainer');

                    appendable = true;

                    for(var i = 0; i < classNames.length; i++)
                        draw(classNames[i], values[i].anger,values[i].disgust,values[i].fear,values[i].joy,values[i].sadness);
                });
            } else {
                stopLoader();
                console.log('no documents found');
            }
        });
    }, function(err) {
        console.log(`Encountered error: ${err}`);
        location.reload();
    });
}());

// Hamburger Menu


function stopLoader() {
    $('.loader').fadeOut('slow', function() {
        $('.comments .inner').fadeIn('slow');
    });
}

function removeItems() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
}

function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}