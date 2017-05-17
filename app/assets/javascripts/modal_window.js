jQuery.noConflict();

//jQuery(function($){

  var openModalWindow = function(url, opts) {
    $.ajax({
      url: url,
      method: opts.method || 'GET',
      dataType: 'script',
      beforeSend: function(data){
        $('#ajax-spinner').show();
      },
      complete: function(data){
        console.log('data = ' + data);
        $('#modal_window').html(data);
        $('#modal_window').addClass('edit ' + opts.class_names || '');
        $('#modal_window').show();
        $('#ajax-spinner').hide();
      }
    });
  };

//});


