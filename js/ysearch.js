var apiKey       = 'AIzaSyA_fCbAdhGZw_ospViJNzkhUJWy78V3NlA';
var countOfVideo = 20;


function init() {
  gapi.client.setApiKey(apiKey);
  gapi.client.load("youtube", "v3", function() {
      // yt api is ready
  });
}

$(function() {
  $("form").on("submit", function(e) {
    var sortVideoByViews    = $('#output').data('sortVideoByViews');
    e.preventDefault();
    
    if (!sortVideoByViews) {
      outputTwentyVideosByDate();
    } else {
      outputTwentyVideosBySortAndAccordion();
    }
  });  
});

