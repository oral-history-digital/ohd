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

  $('form.inline .update').on('click', function(){
    new Effect.Appear('shades', { duration: 0.4, to: 0.6}); 
    $('#ajax_spinner').show();
  });

  $('form.inline .reset').on('click', function(){
    $('#' + actionsId()).hide();
  });

  $('body').on('focus', 'form.inline input, form.inline textarea', function(){
    var _this = $(this);
    $('#' + actionsId(_this)).show();
  });

  function actionsId(elem) {
    return elem.closest('form').attr('id').replace('_form', '_actions');
  };
});


