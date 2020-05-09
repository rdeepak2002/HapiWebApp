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

var username;

$(function() {
  $('#journalArea').on('keyup paste', function() {
    var $el = $(this),
        offset = $el.innerHeight() - $el.height();

    if ($el.innerHeight < this.scrollHeight) {
      //Grow the field if scroll height is smaller
      $el.height(this.scrollHeight - offset);
    } else {
      //Shrink the field and then re-set it to the scroll height in case it needs to shrink
      $el.height(1);
      $el.height(this.scrollHeight - offset);
    }
  });
});

(function() {
    var getUrl = window.location;
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



    // Check if credentials work
    var userRef = firestore.collection('users').doc(String(sessionStorage.getItem("username")));
    username = String(sessionStorage.getItem("username"));
    var pass = String(sessionStorage.getItem("password"));

    //console.log(username);
    //console.log(pass);

    var getDoc = userRef.get()
        .then(function(doc) {
            if (!doc.exists) {
                console.log("redirect now, username doesnt exist");
                window.top.location.href = "/Register";
                removeItems();
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
                    console.log("redirect now password incorrect");
                    window.top.location.href = "/Register";
                    removeItems();
                }
            }
        })
        .catch(function(error) {
            console.log('Error getting document', err);
            console.log("username could not be found");
        });

    //topLoader();


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
    const btnUpload = document.getElementById("fileInput");
    const emailElement = document.getElementById('email');
    const happinessElement = document.getElementById('happiness');

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

    var count = 0;

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
                    var data = documentSnapshot.data();
                    var comment = $('<div class="comment"></div>');
                    var contents = $('<div class="body"></div>');
                    $('<p style="font-size:20px; font-weight: bold;">' + data.title +  ' • ' + data.date + '</p>').appendTo(contents);
                    $('<p>' + data.entry + '</p>').appendTo(contents);
                    if(data.imageUrl != undefined)
                        $('<img style="padding-bottom: 10px;" width="100%" height = "auto" src="'+data.imageUrl+'"></img>').appendTo(contents);
                    $('<b class="deleteBtn" id="'+documentSnapshot.id+'" onClick="deleteEntry(this.id)">Delete</b>').appendTo(contents);
                    $('<a style="float: right;" class="clickable" onClick="window.top.location.href = \'/Dashboard\';">View Analysis</a>').appendTo(contents);


                    contents.appendTo(comment);
                    comment.appendTo('.comments .inner');

                    count++;
                });

                console.log("expected size: " + querySnapshot.size + "  cur size: " + count);
                if(querySnapshot.size==count) {
                    stopLoader();
                    count = 0;
                }
            } else {
                console.log('no documents found');
                stopLoader();
                count = 0;
            }
        });
    }, function(err) {
        console.log(`Encountered error: ${err}`);
        location.reload();
    });

    btnUpload.addEventListener('change', function(e) {
        if($('#fileInput').get(0).files[0] != undefined) {
            startLoader();
            const file = $('#fileInput').get(0).files[0];
            const fileName = new Date() + '-' + username + '-' + file.name;
            const storageRef = firebase.storage().ref();

            // Create the file metadata
            var metadata = {
                contentType: 'image/jpeg'
            };

            // Upload file and metadata to the object 'images/mountains.jpg'
            var uploadTask = storageRef.child('.entryImages/' + username + '/'+ fileName).put(file, metadata);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function(snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function(error) {

                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                }, function() {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        $('.imgUrl').val(downloadURL);

                        stopLoader();
                    });
                });
        }
    });

    btnPost.addEventListener('click', function(e) {
        var title = $('.your-title').val();
        var msg = $('.your-msg').val();

        if((title == '' && guestusername == '') || msg == '')
            return false;
        guestusername = guestusername == '' ? title : guestusername;
        $('.your-title').val("");
        $('.your-msg').val("");

        startLoader();

        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();

        //var formattedDate =  (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + d.getFullYear();

        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ];

        formattedDate = monthNames[month-1] + " " + day + ", " + d.getFullYear();

        var data = {
            date: formattedDate,
            dateObj: d,
            title: title,
            entry: msg,
            username: username
        };

        var postData = {
            text: data.entry
        };

        var nluPostData = {
          'text': data.entry,
          'features': {
            'keywords': {
              'emotion': false,
              'sentiment': true,
              'limit': 249
            }
          }
        }

        var toneData;
        var nluData;
        var parseData;

        $.ajax({
            url: '/Parse',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                parseData = data;

                var dataWithAnalysis;

                console.log("Image exists: " + $('.imgUrl').val() + " : " + imageExists($('.imgUrl').val()));

                if(imageExists($('.imgUrl').val()) || $('.imgUrl').val().indexOf("firebase") != -1) {
                    dataWithAnalysis = {
                        date: formattedDate,
                        dateObj: d,
                        title: title,
                        entry: msg,
                        username: username,
                        nluAnalysis: parseData,
                        imageUrl:$('.imgUrl').val()
                    };

                    var setDoc = firestore.collection('users/'+username+'/journalEntries').add(dataWithAnalysis);

                    $('.imgUrl').val("");
                }
                else {
                    dataWithAnalysis = {
                        date: formattedDate,
                        dateObj: d,
                        title: title,
                        entry: msg,
                        username: username,
                        nluAnalysis: parseData,
                    };

                    var setDoc = firestore.collection('users/'+username+'/journalEntries').add(dataWithAnalysis);

                    $('.imgUrl').val("");

                }

            },
            data: JSON.stringify(postData)
        });
    });
}());

function deleteEntry(clicked_id)
{
    var deleteDoc = firestore.collection('users/'+username+'/journalEntries/').doc(clicked_id).delete();
}

function stopLoader() {
    $('.loader').fadeOut('slow', function() {
        $('.comments .inner').fadeIn('slow');
        $('.send-msg').removeAttr("disabled");  
        $('.send-msg').css({pointerEvents: ''});
    });
}

function startLoader() {
    $('.loader').fadeIn('slow', function() {
        $('.send-msg').attr("disabled", "disabled");
        $('.send-msg').css({pointerEvents: "none"});
        //$('.comments .inner').fadeOut('slow');
    });
}

function removeItems() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
}


function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function imageExists(url){

    var image = new Image();

    image.src = url;

    if (!image.complete) {
        return false;
    }
    else if (image.height === 0) {
        return false;
    }

    return true;
}