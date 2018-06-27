jQuery.noConflict();

jQuery(function($){

  $('.newsletter-subscription').click(function(e){
    $('#newsletter_spinner').show();
    $.ajax({
      url: $(this).attr('link'),
      method: 'POST',
      dataType: 'script'
    }).always(function(data){
      $('#newsletter_spinner').hide();
    })
  });

  $('#edit-user-data').click(function(e){
    $.ajax({
      url: $(this).attr('link'),
      method: 'GET',
      dataType: 'script'
    })
  });

})
