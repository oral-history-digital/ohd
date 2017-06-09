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

  $('#user_content_inline_edit').on('click', function(){
    $(this).closest('.item .inline-editable').each(function(index){
      showInlineEditForm($(this).attr('id', $(this).attr('id')).replace(/_display$/,''), ($(this).nodeType == 'textarea'));
      //var id = $(this).attr('id', $(this).attr('id')).replace(/_display$/,'');
      //showInlineEditForm(id, ($(this).nodeType == 'textarea'));
    }); 
    setItemStatus($(this).closest('.actions'), false)
  });

  $('.inline.edit').on('ajax:before', function(){
    var id = $(this).attr('id').replace('_form', '');
    $('#' + id + '_interface_status').val($('#user_content_' + id).hasClass('closed') ? 'closed' : ''); 
    addExtraneousFormElements($(this), '.edit, .item', '.editor');
  });

  //$('.inline.edit').on('ajax:complete', function(){
    //togglingContent = 0;
  //});

  $('body').on('ajax:before', '#annotations_form', function(){
    new Effect.Fade('modal_window'); 
    $('ajax-spinner').show();
  });

  $('body').on('ajax:complete', '#annotations_form', function(){
    new Effect.Fade('shades');
  });

  $('#topics_form, #publish_form').on('ajax:before', function(){
    $('#modal_window').hide(); 
    $('#ajax-spinner').show();
  });

  $('#topics_form, #publish_form').on('ajax:complete', function(){
    $('#shades').hide();
  });

  $('.inline-editable').on('click', function(){
    var id = $(this).attr('id').replace(/_display$/,'');
    showInlineEditForm(id, true);
  });

  $('form input.edit').on('click', function(){
    Event.stop(event);
  });

  $('form.inline.edit input[type=submit]').on('click', function(){
    togglingContent = 1;
  });

  $('form.inline.edit input[type=reset]').on('click', function(){
    $(this).closest('div').hide();
    var display_id = $(this).closest('div').attr('id').replace(/_form$/, '_display');
    $('#' + display_id).show(); 
    //Event.stop(event);
  });

});


