/* Facet toggling and submission */
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
    $('search_facets_overlay').show();
    $('search_header_overlay').show();
  }

  function afterResponse() {
    $('search_header_overlay').hide();
    $('search_facets_overlay').hide();
  }

  function checkCategory(id, labelElement) {
      var facetName = id.sub(/_\d+$/,'');
      var input = $(id);
      var item = labelElement.up('.facet');
      if((input) && (item)) {
          if(item.hasClassName('checked')) {
              input.checked = false;
              item.removeClassName('checked');
          } else {
              input.checked = true;
              item.addClassName('checked');
          }
          Element.show(facetName + '_submit');
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