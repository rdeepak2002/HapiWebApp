function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}
var searchTerm = "";

$(function() {
    $("form").on("submit", function(e) {
        function firstFunction(_callback){
           var stringTerms = $( "#joyPlaceholder" ).text();
           var terms = [];

           terms = stringTerms.split(',');
           searchTerm = terms[Math.floor(Math.random() * terms.length)];

           if(searchTerm != undefined) {
              _callback();    
           }
        }

        function secondFunction(){
            // call first function and pass in a callback function which
            // first function runs when it has completed
            firstFunction(function() {
               e.preventDefault();
               // prepare the request
               //console.log("Searching: " + searchTerm.trim());

               var request = gapi.client.youtube.search.list({
                    part: "snippet",
                    type: "video",
                    q: searchTerm,
                    maxResults: 3,
                    order: "relevance",
                    publishedAfter: "2006-01-01T00:00:00Z"
               }); 
               // execute the request
               request.execute(function(response) {
                  var results = response.result;
                  $("#results").html("");
                  $.each(results.items, function(index, item) {
                    $.get("item.html", function(data) {
                        $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
                    });
                  });
                  resetVideoHeight();
               });
            });   

        }


        secondFunction();

    });
    
    $(window).on("resize", resetVideoHeight);
});

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}

function init() {
    gapi.client.setApiKey("AIzaSyCkZl-8ADD3DekUAdSF9dssiRQJasW86UI");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}
