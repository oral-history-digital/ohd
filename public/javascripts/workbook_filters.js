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
      var changed = false;
      var checkedInput = (id == null) ? null : $(id);
      var facets = labelElement.up('.facet-field');
      var fullSelect = facets.down('.facet input');
      var invertValue = (checkedInput && fullSelect && !fullSelect.checked) ? (checkedInput.checked ? true : false) : false;
      facets.select('.checkbox').each(function(input){
          var currentItem = input.up('.facet');
          var newStatus = ((checkedInput == null) || (input.id == id)) ? !invertValue : invertValue;
          var setStatus = false;
          // alert('Status for ' + input.id + ' = ' + (newStatus ? 'CHECKED' : 'NOT CHECKED') + ',\ncurrent status: ' + input.checked + '\nvalue = ' + input.value + '\n\ninvertValue: ' + invertValue);
          if(newStatus && !input.checked) {
              // only set the fullSelect if it was directly clicked
              if(!((input.id == fullSelect.id) && checkedInput)) {
                  changed = true;
                  setStatus = true;
                  input.checked = true;
                  currentItem.addClassName('checked');
              }
          }
          if(!newStatus && input.checked) {
              changed = true;
              setStatus = true;
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