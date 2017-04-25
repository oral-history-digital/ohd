$(document).ready(function(){

  $('.update-selection').on('click', filterSubmit());

  var filterElements = $$('#userFilters .filter');
  filterElements.each(function(filter){
      new Form.Element.Observer(filter, 1, onFilterChange);
  });
  var currentFilters = getFilterSettings();

  function filterSubmit() {
      currentFilters = getFilterSettings();
      var queryURL = window.location.pathname + '?' + currentFilters.toQueryString();
      new Ajax.Updater('user_list', queryURL, {
          method: 'get',
          onLoading: function() { new Effect.Appear('shades', { from: 0, to: 0.4 }); $('submit_filters').hide(); },
          onComplete: function() { new Effect.Fade('shades', { from: 0.4, to: 0 }); }
      });
  };

  function onFilterChange() {
      if(filterChanged()) {
          $('submit_filters').show();
      }
  };

  function getFilterSettings() {
      var settings = new Hash();
      filterElements.each(function(filter){
          var filterName = filter.id;
          var filterValue = Form.Element.getValue(filterName);
          if(filterValue != '') {
              settings.set(filterName, filterValue);
          }
      });
      return settings;
  };

  function filterChanged() {
      var settings = getFilterSettings();
      var changed = false;
      filterElements.each(function(filter){
          if(settings.get(filter.id) != currentFilters.get(filter.id)) {
              changed = true;
          }
      });
      return changed;
  };

}
