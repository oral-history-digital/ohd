jQuery.noConflict();

jQuery(function($){

  $("#expand_all").click(function(){
    expandAllContents();
  });
  $("#minimize_all").click(function(){
    minimizeAllContents();
  });
  $("#activate_sorting").click(function(){
    sortDialogInstructions(); 
    currentSorting.activateSorting();
  });
  $("#finalize_sorting").click(function(){
    currentSorting.finalizeSorting();
  });
  $("#cancel_sorting").click(function(){
    currentSorting.cancelSorting();
  });

  $(".toggle").click(function(){
    var elem = $(this).attr('toggle');
    $(elem).toggle();
  });
  
  $(".open_modal").click(function(){
    var close = $(this).attr('close');
    $(close).addClass('closed');

    var url = $(this).attr('url');
    var classNames = 'topics ' + $(this).attr('class_names');

    openModal(url, {class_names: classNames});
  });

});


