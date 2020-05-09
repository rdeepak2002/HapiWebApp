var pColor;
var sColor;
var bgImg;
var profileImg;
var username;

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

(function() {
    var guestusername = '';
    var hideable = document.getElementById("hide");
    hideable.style.display = "none";

    // Check session storage
    if(sessionStorage.getItem("username") == null || sessionStorage.getItem("password") == null) {
        removeItems();
        window.top.location.href = "/Register";
    }

    // Check if credentials work
    var userRef = firestore.collection('users').doc(String(sessionStorage.getItem("username")));
    username = String(sessionStorage.getItem("username"));
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

    stopLoader();

    // Get elements
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    const pColorElement = document.getElementById('pColor');
    const sColorElement = document.getElementById('sColor');
    const bgElement = document.getElementById('bgElement');
    const btnUpload1 = document.getElementById("fileInput1");
    const btnUpload2 = document.getElementById("fileInput2");


    btnUpload1.addEventListener('change', function(e) {
        if($('#fileInput1').get(0).files[0] != undefined) {
            startLoader();
            const file = $('#fileInput1').get(0).files[0];
            const fileName = new Date() + '-' + username + '-' + file.name;
            const storageRef = firebase.storage().ref();

            // Create the file metadata
            var metadata = {
                contentType: 'image/jpeg'
            };

            // Upload file and metadata to the object 'images/mountains.jpg'
            var uploadTask = storageRef.child('.entryImages/' + username + '/' + fileName).put(file, metadata);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function (snapshot) {
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
                }, function (error) {

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
                }, function () {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        console.log(downloadURL);

                        $("#bgElement").val(downloadURL);

                        stopLoader();
                    });
                });
        }
    });



    btnUpload2.addEventListener('change', function(e) {
        if($('#fileInput2').get(0).files[0] != undefined) {
            startLoader();
            const file = $('#fileInput2').get(0).files[0];
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
                        console.log(downloadURL);

                        $("#profileElement").val(downloadURL);

                        stopLoader();
                    });
                });
        }
    });



    // Observing user
    var doc = firestore.collection('users').doc(username);
    var observer = doc.onSnapshot(function(docSnapshot) {
        pColor = docSnapshot.data().pColor;
        sColor = docSnapshot.data().sColor;
        bgImg = docSnapshot.data().bgImg;
        profileImg = docSnapshot.data().profileImg;

        $("#pColor").attr("value", pColor);
        $("#sColor").attr("value", sColor);

        emailElement.innerText = docSnapshot.data().email;
        usernameElement.innerText = username;

        pColorElement.innerText = pColor;
        sColorElement.innerText = sColor;
        bgElement.value = bgImg;
        profileElement.value = profileImg;

        if(pColor != undefined) {
            $(".profile-header-img > img.img-circle").css("border", "2px solid "+pColor+"");
            $(".label.label-default.rank-label").css("background-color", pColor);
        }

        if(sColor != undefined) {
            $("li").css("color", sColor);
        }

        if(bgImg != undefined && bgImg != '' && bgImg != 'Blank' && bgImg != 'Blank Image') {
            $("#bgImageB").attr('src',bgImg);
            // $("body").css("background-image", "url("+bgImg+")");
            // $("body").css("background-size", "cover");
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
}());

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

$('#pColor').on('change', function(){
    var doc = firestore.collection('users').doc(username);
    var newColor = $(this).val();
    doc.update({ "pColor" :  newColor});
});

$('#sColor').on('change', function(){
    var doc = firestore.collection('users').doc(username);
    var newColor = $(this).val();
    doc.update({ "sColor" :  newColor});
});

$( "#bgButton" ).click(function() {
    var doc = firestore.collection('users').doc(username);
    var newUrl = $('#bgElement').val();
    if(newUrl.trim() != '')
        doc.update({ "bgImg" :  newUrl});
    else
        doc.update({ "bgImg" :  "Blank"});
});

$( "#profileButton" ).click(function() {
    var doc = firestore.collection('users').doc(username);
    var newUrl = $('#profileElement').val();
    if(newUrl.trim() != '')
        doc.update({ "profileImg" :  newUrl});
    else
        doc.update({ "profileImg" :  "https://images-na.ssl-images-amazon.com/images/I/31yKg%2B0tevL._SX425_.jpg"});
});



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
    });
}

function removeItems() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
}