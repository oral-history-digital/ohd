jQuery(function(){

  jQuery('.newsletter-subscription').click(function(e){

    jQuery('#newsletter_spinner').show();

    jQuery.ajax({
      url: jQuery(this).attr('link'),
      method: 'POST',
      dataType: 'script'
    }).always(function(data){
      jQuery('#newsletter_spinner').hide();
    })

  });

})
