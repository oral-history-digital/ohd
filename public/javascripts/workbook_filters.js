/* JS-API for the workbook filter effects and functionality */

  function invertSelection(elem) {
    var selection = elem.parentNode.getElementsBySelector('.facet');
    var changed = false;
    selection.each(function(facet){
        var input = facet.down('.checkbox');
        if(facet.hasClassName('checked')) {
          if($$('#content_filters .checked').length > 1) {
              input.checked = false;
              facet.removeClassName('checked');
              changed = true;
          }
        } else {
          input.checked = false;
          facet.addClassName('checked');
          changed = true;
        }
    });
    return changed;
  }

  function checkFilter(id, labelElement) {
      var input = $(id);
      var item = labelElement.hasClassName('facet') ? labelElement : labelElement.up('.facet');
      if((input) && (item)) {
          var changed = false;
          if(item.hasClassName('checked')) {
              input.checked = true; // true means remove this item
              item.removeClassName('checked');
              changed = true;
          } else {
              input.checked = false; // false means keep it
              item.addClassName('checked');
              changed = true;
          }
          /*
          if(!invertSelection(input)) {
            // invert all checkboxes
            invertSelection(item);
          }
          */
          input.up('form').request();
          new Effect.Appear('overlay', { duration: 0.3, to: 0.9, queue: 'front' });
      }
  }