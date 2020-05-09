$(function() {
    $('#login-form-link').click(function(e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
});

(function ($) {
    'use strict';

    // -----------------------------
    //  On Scroll Resize Nav
    // -----------------------------
    $(document).on('scroll', function() {
        if($(document).scrollTop()>100) {
            $('.main-nav').removeClass('large').addClass('small');
        } else {
            $('.main-nav').removeClass('small').addClass('large');
        }
    });

    // -----------------------------
    //  On Click Smooth scrool
    // -----------------------------
     $('.scrollTo').on('click', function(e) {
         e.preventDefault();
         var target = $(this).attr('href');
         $('html, body').animate({
           scrollTop: ($(target).offset().top)
         }, 500);
      });
    // -----------------------------
    //  On Click Smooth scrool
    // -----------------------------
     $('.scrollTo').on('click', function(e) {
         e.preventDefault();
         var target = $(this).attr('href');
         $('html, body').animate({
           scrollTop: ($(target).offset().top)
         }, 500);
      });

    $(document).on('ready', function () {
        // -----------------------------
        //  On Scroll Resize Nav
        // -----------------------------
        $(document).on('scroll', function() {
            if($(document).scrollTop()>100) {
                $('.main-nav').removeClass('large').addClass('small');
            } else {
                $('.main-nav').removeClass('small').addClass('large');
            }
        });
        // -----------------------------
        //  On Click Smooth scroll
        // -----------------------------
        $('.scrollTo').on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $('html, body').animate({
                scrollTop: ($(target).offset().top)
            }, 500);
        });
        // -----------------------------
        //  Testimonial Slider
        // -----------------------------
        $('.testimonial-slider').slick({
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false
                    }
                }
            ]
        });
        // -----------------------------
        //  Screenshot Slider
        // -----------------------------
        $('.screenshot-slider').slick({
            dots: true,
            slidesToShow: 3,
            centerMode: true,
            infinite: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false
                    }
                }
            ]
        });
        // -----------------------------
        //  Video Replace
        // -----------------------------
        $('.video-box span.icon').click(function() {
            var video = '<iframe allowfullscreen src="' + $(this).attr('data-video') + '"></iframe>';
            $(this).replaceWith(video);
        });
        // -----------------------------
        //  Team Progress Bar
        // -----------------------------
        $('.team').waypoint(function(){
            $('.progress').each(function(){
                $(this).find('.progress-bar').animate({
                    width:$(this).attr('data-percent')
                });
            });
            this.destroy();
        },{
            offset:100
        });

    });


})(jQuery);

(function() {
    removeItems();
    var getUrl = window.location;
    var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    baseUrl = "http://hapidiary.com";

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

    // Get elements
    const txtEmail = document.getElementById('txtEmail');
    const txtUsername = document.getElementById('txtUsername');
    const txtPassword = document.getElementById('txtPassword');
    const txtUsernameR = document.getElementById('txtUsernameR');
    const txtPasswordR = document.getElementById('txtPasswordR');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignUp = document.getElementById('btnSignUp');

    // Add login event
    btnLogin.addEventListener('click', function(e) {
        // Get text from elements
        var username = String(txtUsername.value);
        var pass = String(txtPassword.value);

        if(username.length <= 0 && pass.length <= 0) {
            document.getElementById("loginError").innerHTML = "Incorrect username or password";
        }
        else {
            login(username, pass);
        }
    });

    function login(username, pass) {
        // Check data with firestore data
        var userRef = firestore.collection('users').doc(username);
        var getDoc = userRef.get()
            .then(function(doc) {
                if (!doc.exists) {
                    document.getElementById("loginError").innerHTML = "Incorrect username or password";
                }
                else {
                    var usernameC = doc.data().username;
                    var passwordC = doc.data().password;
                    if(username == usernameC && SHA256(pass) == passwordC) {
                        console.log("logging in...");
                        removeItems();
                        sessionStorage.setItem('username',username);
                        sessionStorage.setItem('password',SHA256(pass));
                        window.top.location.href = "/Home";
                        document.getElementById("loginError").innerHTML = "";
                    }
                    else {
                        console.log("expected: " + usernameC + ", " + passwordC);
                        console.log("received: " + username + ", " + pass);
                        document.getElementById("loginError").innerHTML = "Incorrect username or password";
                    }
                }
            })
            .catch(function(error) {
                console.log('Error getting document', err);
            });
    }

    // Add signup event
    btnSignUp.addEventListener('click', function(e) {
        // Get username, email, and pass
        const username = txtUsernameR.value;
        const email = txtEmail.value;
        const pass = txtPasswordR.value;
        const happiness = 0;

            if(checkValidity()) {
                var data = {
                    username: username,
                    password: SHA256(pass),
                    email: email,
                    happiness: happiness,
                    pColor: '#51D2B7',
                    sColor: '#66b34e',
                    tColor: '#ffffff00', 
                    bgImg: 'Blank Image',
                    profileImg: 'https://images-na.ssl-images-amazon.com/images/I/31yKg%2B0tevL._SX425_.jpg'
                };

                firestore.collection('users').doc(username)
                    .update({data})
                    .then(() => {
                        document.getElementById("usernameMsg").innerHTML = "Username already taken";
                    })
                    .catch((error) => {
                        // Add credential to session storage to be checked
                        document.getElementById("usernameMsg").innerHTML = "";
                        var setDoc = firestore.collection('users').doc(username).set(data);
                        sessionStorage.setItem('username',username);
                        sessionStorage.setItem('password',SHA256(pass));

                        console.log("created user");
                        login(username, pass);
                    });
            }
        });
}());

function checkValidity() {
    // result
    var result = true;

    // Get elements
    const email = String(document.getElementById('txtEmail').value);
    const username = String(document.getElementById('txtUsernameR').value);
    const pass = String(document.getElementById('txtPasswordR').value);
    const passC = String(document.getElementById('txtPasswordConfirmR').value);

    var usernameRegex = new RegExp("^[A-z0-9_-]{3,15}$");
    var emailRegex = new RegExp("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])");
    var passwordRegex = new RegExp("((?=.*[A-z]).{6,20})");

    if (!usernameRegex.test(username)) {
        document.getElementById("usernameMsg").innerHTML = "Username must contain 3-15 characters and may only include letters or numbers";
        result = false;
    }
    else {
        document.getElementById("usernameMsg").innerHTML = "";
    }

    if (!emailRegex.test(email)) {
        document.getElementById("emailMsg").innerHTML = "Invalid email";
        result = false;
    }
    else {
        document.getElementById("emailMsg").innerHTML = "";
    }

    if (!passwordRegex.test(pass)) {
        document.getElementById("passwordMsg").innerHTML = "Password must contain 6-20 characters and may only include letters or numbers";
        result = false;
    }
    else {
        document.getElementById("passwordMsg").innerHTML = "";
    }

    if (pass!==passC) {
        document.getElementById("passwordCMsg").innerHTML = "Passwords do not match";
        result = false;
    }
    else {
        document.getElementById("passwordCMsg").innerHTML = "";
    }

    if(email.length <= 0 || username.length <= 0 || pass.length <= 0 || passC.length <= 0) {
        result = false;
    }

    if(result) {
        console.log("valid input");
    }
    else {
        console.log("invalid input");
    }

    return result;
}

function removeItems() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
}

function SHA256(s){
    var chrsz  = 8;
    var hexcase = 0;
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
        }
        return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}