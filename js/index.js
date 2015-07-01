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
        console.log('successs');
        //location.reload();
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  $('.draggable').draggable({ 
    zIndex: 2,
    revert: true,
    handle: '.handle'
  });

  $(".droppable").droppable({
    tolerance: 'pointer',
    activeClass: "ui-state-default",
    hoverClass: "ui-state-hover",
    drop: function( event, ui ) {
      var html = $(this).html();
      var $el = $(this);
      var bucketName = $el.data('name');
      var postId = $(ui.draggable).data('id');
      addToBucket(bucketName, postId);
      $(this)
        .addClass( "ui-state-highlight" )
        .find("p")
          .html("Added!");
      setTimeout(function () {
        $el.html(html).removeClass('ui-state-highlight');
      }, 1000);
    }
  });

  $('.create-new-bucket').click(function() {
    var bucketName = prompt('Please enter a name for the new bucket. Please use only dashes, not spaces, between words');
    
    if (!bucketName) return;

    createBucket(bucketName);
  });

});