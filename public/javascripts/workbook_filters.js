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

  function checkTag(id, labelElement) {
      var changed = false;
      var checkedInput = (id == null) ? null : $(id);
      var facets = labelElement.up('.facet-field'); // (id == null) ? labelElement.up('.container-toggle').next('.container').down('.facet-field') : labelElement.up('.facet-field');
      facets.select('.checkbox').each(function(input){
          var currentItem = input.up('.facet');
          if((checkedInput == null) || (input.id == id)) {
              if(!input.checked) { changed = true; }
              input.checked = true;
              currentItem.addClassName('checked');
          } else {
              if(input.checked) { changed = true; }
              input.checked = false;
              currentItem.removeClassName('checked');
          }
      });
      if(changed) {
          labelElement.up('form').request();
          new Effect.Appear('overlay', { duration: 0.3, to: 0.9, queue: 'front' });
      }
  }

  function interfaceStatusValueOf(id) {
      return ($(id).hasClassName('closed') ? 'closed' : '');
  }

  function showInlineEditForm(id, textArea) {
      var displayEl = $(id + '_display');
      var formEl = $(id + '_form');
      var inputEl = $(id);
      var fieldWidth = displayEl.offsetWidth - 20;
      var fieldHeight = displayEl.offsetHeight + 25;
      displayEl.hide();
      inputEl.value = displayEl.innerHTML;
      formEl.show();
      var inputStyle = { width: fieldWidth + 'px'};
      if(textArea) {
          inputStyle = { width: fieldWidth + 'px', height: fieldHeight + 'px'};
      }
      inputEl.setStyle(inputStyle);
      Form.Element.focus(id);
  }

  function addExtraneousFormElements(form, scope, selector) {
      var existing = form.getInputs();
      form.up(scope).getElementsBySelector(selector).each(function(input){
          if(existing.indexOf(input) < 0) {
            form.insert(new Element('input', {name: input.getAttribute('name'), value: input.value, type: 'hidden'}));
          }
      });
  }

  function toggleFormAction(id) {
      togglingContent = 1;
      $(id + '_update').toggle();
      $(id + '_reset').toggle();
      $(id + '_spinner').toggle();
  }