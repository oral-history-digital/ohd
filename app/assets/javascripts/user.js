jQuery.noConflict();

jQuery(function($){
  $('.subdued').click(function(){
    $('.inline-editor select, .inline-editor input, .inline-editor textarea').prop('disabled', true).hide(); 
    $('.inline-editable').show();
    $('#user_registration_data_actions').hide(); 
    $('#shades').hide(); 
    $('#modal_window').hide();
  });

  $('ul#user_list').on('click', '.admin-flag', function(){
    var id = $(this).attr('flag_id');
    $.ajax({
      url: $(this).attr('link'),
      method: 'POST',
      dataType: 'script',
      beforeSend: function(data){
        $('#admin-' + id + '-spinner').show();
      }
    });
  });

});
