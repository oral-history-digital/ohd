j = jQuery.noConflict();

var openModalWindow = function(url, opts) {
  j.ajax({
    url: url,
    method: opts.method || 'GET',
    dataType: 'script',
    beforeSend: function(data){
      j('#ajax-spinner').show();
    },
    complete: function(data){
      //j('#modal_window').html(data);
      //j('#modal_window').addClass('edit ' + opts.class_names || '');
      //j('#modal_window').show();
      //j('#ajax-spinner').hide();
    }
  });
};

function closeModalWindow() {
  new Effect.Fade('shades', { from: 0.6, to: 0, duration: 0.4 });
  var win = j('#modal_window');
  win.hide();
  win.html('');
}

jQuery(function($){

  $("#modal_window").on('click', "#modal_window_close", function(){
    closeModalWindow(); 
    return false;
  });

});


