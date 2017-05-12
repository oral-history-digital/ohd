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
  
  $(".container-toggle").click(function(){
    var elem = $(this).attr('toggle');
    toggleContainer(elem, true, false);
  });
  
  $("ul.facet-field li.facet").click(function(){
    //alert('bla');
    var checkFilterId = $(this).attr('check_filter_id') || null;
    checkFilter(checkFilterId, this); 
  });
  
});


