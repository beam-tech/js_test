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

      //output result
      $("#output").empty();
      $.each(results.items, function(index, item) {
        $('<div class="ss_button">').append(item.snippet.title).appendTo('#output');
        $('<iframe>', {
                      src: 'https://www.youtube.com/embed/' + item.id,
                    align: 'top',
              frameborder: 0,
          allowFullScreen: ''
        }).appendTo('#output')
          //.css('display', 'block')
          .wrap('<div class="ss_content"></div>')
          .after(
             '<p><b>название ролика: </b>' + item.snippet.title         + '</p>' +
             '<p><b>автор: </b>'           + item.snippet.channelTitle  + '</p>' +
             '<p><b>дата публикации: </b>' + new Date(item.snippet.publishedAt).toLocaleDateString("ru-RU")  + '</p>' +
             '<p><b>просмотры : </b>'      + item.statistics.viewCount + '</p>'
          );
      });

      //The Stupid Simple jQuery Accordion
      $(function() {
        $('.ss_button').on('click',function() {
          $('.ss_content').slideUp('fast');
          $(this).next('.ss_content').slideDown('fast');
        });
      });
    });
  });
}