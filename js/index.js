$(document).ready(function() {
  
  function createBucket(name) {
    $.ajax({
      url: '/buckets/new',
      type: 'POST',
      data: {
        name: name
      },
      success: function (response) {
        location.reload();
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  function addToBucket(bucketName, postId) {
    $.ajax({
      url: '/buckets/addpost',
      type: 'POST',
      data: {
        postId: postId,
        bucket: bucketName
      },
      success: function (response) {
        var
          $post = $('#posts [data-id="' + postId + '"]');
          buckets = $post.data('buckets');

        if (buckets.indexOf(bucketName) === -1) {
          console.log('adding bucketname');
          $post.data('buckets', buckets ? buckets + ',' + bucketName : bucketName);
        }
        //location.reload();
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  function trackPost(postId) {
    $.ajax({
      url: '/tracking/addpost',
      type: 'POST',
      data: {
        postId: postId
      },
      success: function (response) {
        var
          $post = $('#posts [data-id="' + postId + '"]');
        $post.data('tracking', 'true');
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  $('#posts').mixItUp();

  $('.post').mouseenter(function(event) {
    event.stopPropagation();
    var
      highlight = $(this).data('buckets') && $(this).data('buckets').split(',');
    if (highlight) {
      for (var i = 0; i < highlight.length; i++) {
        $('.buckets [data-name="' + highlight[i] + '"]').addClass('btn-info');
      }
    }
  }).mouseleave(function() {
    $('.bucket').removeClass('btn-info');
  });

  $('.draggable').draggable({ 
    zIndex: 2,
    revert: true,
    handle: '.handle'
  });

  $(".droppable-bucket").droppable({
    tolerance: 'pointer',
    activeClass: "btn-primary",
    hoverClass: "btn-info",
    drop: function( event, ui ) {
      var html = $(this).html();
      var $el = $(this);
      var bucketName = $el.data('name');
      var postId = $(ui.draggable).data('id');
      addToBucket(bucketName, postId);
      $(this).addClass("btn-success").html("Added!");
      setTimeout(function () {
        $el.html(html).removeClass('btn-success');
      }, 1500);
    }
  });

  $(".droppable-tracking").droppable({
    tolerance: 'pointer',
    activeClass: "btn-primary",
    hoverClass: "btn-info",
    drop: function( event, ui ) {
      var html = $(this).html();
      var $el = $(this);
      var postId = $(ui.draggable).data('id');
      trackPost(postId);
      $(this).addClass("btn-success").html("Added!");
      setTimeout(function () {
        $el.html(html).removeClass('btn-success');
      }, 1500);
    }
  });

  $('.create-new-bucket').click(function() {
    var bucketName = prompt('Please enter a name for the new bucket. Please use only dashes, not spaces, between words');
    
    if (!bucketName) return;

    createBucket(bucketName);
  });

});