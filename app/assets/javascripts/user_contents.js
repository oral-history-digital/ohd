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

});


