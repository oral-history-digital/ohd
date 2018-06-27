/* JS-API for the workbook filter effects and functionality */

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