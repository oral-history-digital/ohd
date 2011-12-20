/* Facet toggling and submission */

  // Parse the hashed search string and submit a search
  var searchParams = [];
  function submitHashedQueryParams(){
      var hash = window.location.hash.sub(/^#/,'');
      alert('Checking for query hash=' + hash + '\ncurrentHash=' + queryHash);
      //document.URL.scan(/#[a-zA-Z0-9]+(==)?$/, function(str){ hash=String.interpret(str).gsub(/[#=,]/,''); });
      if(hash != queryHash) {
        // Change the form submit:
        var searchForm = $('search_facets');
        queryHash = hash;
        if(searchForm) {
            alert('Submitting for query hash=' + hash);
            searchForm.onsubmit = new Ajax.Request('/suche',{asynchronous: true, evalScripts: true, method: 'get', parameters: { 'suche': hash }});
        } else {
            alert('ERROR:\nsearchForm = ' + searchForm);
        }
     }
  }

  function setQueryHashInURL(hash){
      queryHash = hash;
      window.location.hash = hash.sub(/^#/,'');
      if(searchParams.size == 0) {
          clearFulltextField('searchInput');
          var searchForm = $('search_facets');
          var formInputs = searchForm.getInputs('text');
          formInputs.concat(searchForm.getInputs('checkbox'));
          formInputs.each(function(el){ searchParams.push(el.name); });
          alert('Setting searchParameters to ' + searchParams);
      }
      // document.URL = document.URL.sub(/#[A-Za-z0-9]+(==)?/, '#' + hash);
  }

  // blind effect for category facets
  function toggleCategory(id, blindToggle) {
    var cat_index = -1;
    for(var i=0; i< categoryElems.length; i++) {
      if (id == categoryElems[i].id) {
          cat_index = i;
      }
    }
    if(cat_index > -1) {
      var parent = $(id.sub(/_query$/,''));
      if(parent.hasClassName('closed')) {
        checkFormSubmission(parent.id);
        // show
        if(blindToggle) {
          Effect.BlindDown(id, { duration: 0.4, transition: Effect.Transitions.sinoidal });
        } else {
          Element.show(id);
        }
        parent.removeClassName('closed');
        parent.addClassName('open');
      } else {
        // hide
        if(blindToggle) {
          Effect.BlindUp(id, { duration: 0.4, transition: Effect.Transitions.sinoidal, afterFinish: markClosed(parent) });
        } else {
          Element.hide(id);
          markClosed(parent);
        }
      }
    }
  }

  // check for form submission
  function checkFormSubmission(openCategory) {
    if(categoryChange) {
      if(openCategory) {
        $('open_category').value = openCategory;
      }
      submitViaAjax();
    }
  }

  // closing happens after the blind effect finishes...
  function markClosed(elem) {
    elem.removeClassName('open');
    elem.addClassName('closed');
    checkFormSubmission(false);
  }

  function categoryState(id, state, checkbox) {
      var input = $(id);
      if(checkbox) {
          input.checked = state;
      } else {
          input.value = '';
      }
  }

  function submitViaAjax() {
    beforeSubmit();
    Form.request('search_facets');
  }

  function beforeSubmit() {
    categoryChange = false;
    clearFulltextField('searchInput');
    var veil = $('ajax-spinner');
    var newHeight = window.innerHeight - $('baseHeader').offsetHeight;
    veil.style.height = newHeight; // setStyle({ height: newHeight});

    alert('Setting overlay height to:' + newHeight + '\nwindow.innerHeight: ' + window.innerHeight + '\nbaseHeader.height: ' + $('baseHeader').offsetHeight);
    $('overlay').show();
    var i = 0;
    // while(i<1000000000) { i = i + 1; }
  }

  function afterResponse() {
    $('overlay').hide();
  }

  function checkCategory(id, labelElement) {
      var facetName = id.sub(/_\d+$/,'');
      var input = $(id);
      var item = labelElement.hasClassName('facet') ? labelElement : labelElement.up('.facet');
      if((input) && (item)) {
          if(item.hasClassName('checked')) {
              input.checked = false;
              item.removeClassName('checked');
          } else {
              input.checked = true;
              item.addClassName('checked');
          }
          new Effect.Appear(facetName + '_submit', { duration: 0.33 });
      }
  }


/* show the Segments in the result teaser */
function showSegment(archiveID, mediaID) {
  $$('#interview_' + archiveID + '_segments .segment').each(function(el){
    el.removeClassName('visible');
  });
  $$('#interview_' + archiveID + '_segments .segment_pagination li').each(function(el) {
    el.removeClassName('current');
  });
  $(mediaID).addClassName('visible');
  $(mediaID + '_link').addClassName('current');
}