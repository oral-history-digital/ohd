

  // blind effect for accordion-container
  function toggleContainer(parentId, blindToggle) {
    var cat_index = -1;
    var id = parentId.sub('-toggle','');
    for(var i=0; i< containerElems.length; i++) {
      if (parentId == containerElems[i].id) {
          cat_index = i;
      } else {
          $(containerElems[i].id.sub('-toggle','')).hide();
          markClosed(containerElems[i]);
      }
    }
    if(cat_index > -1) {
      var parent = $(parentId);
      if(parent.hasClassName('closed')) {
        // show
        if(blindToggle) {
          new Effect.BlindDown(id, { duration: 0.8, transition: Effect.Transitions.sinoidal });
        } else {
          Element.show(id);
        }
        parent.addClassName('open');
        parent.removeClassName('closed');
      } else {
        // hide
        if(blindToggle) {
          new Effect.BlindUp(id, { duration: 0.5, transition: Effect.Transitions.sinoidal, afterFinish: markClosed(parent) });
        } else {
          Element.hide(id);
          markClosed(parent);
        }
      }
    }
  }

  function markClosed(el) {
      if(el) {
          el.addClassName('closed');
          el.removeClassName('open');
      }
  }