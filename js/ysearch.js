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


function outputTwentyVideosByDate() {
  // prepare the search request
  var request = gapi.client.youtube.search.list({
    q: $("#search").val(),
    part: 'id, snippet',
    type: 'video',
    order: 'date',
    maxResults: countOfVideo
  }); 
       

  request.execute(function(response) {
    $("#output").empty();
    var results = response.result;
    $.each(results.items, function(index, item) {
      $('<iframe>', {
         src: "https://www.youtube.com/embed/" + item.id.videoId,
         frameborder: 0,
         allowFullScreen: ''})
         .appendTo('#output');
    });
  });
}


function outputTwentyVideosBySortAndAccordion() {
  // prepare the search request 
  var requestSearchByDate = gapi.client.youtube.search.list({
             q: $("#search").val(),
          part: 'id',
          type: 'video',
         order: 'date',
    maxResults: countOfVideo
  }); 
  
  requestSearchByDate.execute(function(response) {
    var results = response.result;
    //get array of video ids
    var videoIds = results.items.map(function(item) {
      return item['id']['videoId'];
    })

    //prepare the request videos
    var requestVideosByViewCount = gapi.client.youtube.videos.list({
              id: videoIds.toString(),    
            part: 'snippet, statistics',
      maxResults: countOfVideo
    });

    
    requestVideosByViewCount.execute(function(response) {
      results = response.result;

        //sort video(object) by view count
      results.items.sort(function(a, b) {
        return b.statistics.viewCount - a.statistics.viewCount;
      });


    });
  });
}