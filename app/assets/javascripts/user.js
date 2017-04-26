jQuery.noConflict();

$(function(){
  $('.subdued').click(function(){
    $('.inline-editor select, .inline-editor input, .inline-editor textarea').prop('disabled', true).hide(); 
    $('.inline-editable').show();
    $('#user_registration_data_actions').hide(); 
    $('#shades').hide(); 
    $('#modal_window').hide();
  });
});
