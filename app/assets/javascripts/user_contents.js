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
  
  $('#user_content_edit').click(function(){
    setItemStatus($(this).parent().find('.actions'), true); 
    //Event.stop(event);
  });

  $('#user_content_close').click(function(){
    setItemStatus($(this).parent(), false); 
    //Event.stop(event);
  });

  $('#user_content_inline_edit').click(function(){
    $(this).closest('.item .inline-editable').each(function(index){
      showInlineEditForm($(this).attr('id', $(this).attr('id')).replace(/_display$/,''), ($(this).nodeType == 'textarea'));
    }); 
    setItemStatus($(this).closest('.actions'), false)
  });
});


