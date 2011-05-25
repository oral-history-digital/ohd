

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

  function openContainer(parentId, blindToggle) {
        if($(parentId).hasClassName('closed')) {
            toggleContainer(parentId, blindToggle);
        }
  }

  function markClosed(el) {
      if(el) {
          el.addClassName('closed');
          el.removeClassName('open');
      }
  }

  function setVolume(event) {
    var width = $('volumeSelect').getWidth();
    var on = ((Event.pointerX(event)) - ($('volumeSelect').cumulativeOffset().left));
    archiveplayer('interview-player').setVolume(Math.round((100 / width) * on));
  }

  function drawVolumeBar(percentage) {
    var width = $('volumeSelect').getWidth();
    var on = Math.round(percentage / (100 / width));
    var scale = Math.round((on / $('volumeOn').getWidth()) * 100);
    new Effect.Scale($('volumeOn'), scale, {scaleY: false, duration: 0.1});
  }

  function drawMuteButton(state) {
    var id = $('volumeMuteButton');
    if(id) {
      if(state) {
        id.addClassName('mute');
        id.removeClassName('unmute');
      } else {
        id.addClassName('unmute');
        id.removeClassName('mute');
      }
    }
  }

  /* Gallery Effects */

    var galleryFading = 0;
    var galleryFadeState = 0;
    var galleryElem = null;
    var galleryReset = 1;

    function fadeInGallery() {
        if(!galleryElem) { return; }
        if((galleryFadeState == 0) && (galleryFading == 0)) {
            galleryFading = 1;
            galleryFadeState = 1;
            new Effect.Appear(galleryElem, { from: 0.3, duration: 0.5, afterFinish: function(){ galleryFading = 0; galleryReset = 1; }});
        }
    }

    function fadeOutGallery() {
        if(!galleryElem) { return; }
        if(galleryFadeState == 1) {
            if(galleryFading == 0) {
                galleryFading = 1;
                galleryFadeState = 0;
                new Effect.Fade(galleryElem, { to: 0.3, duration: 1.2, afterFinish: function(){ galleryFading = 0; }});
            } else {
                if(galleryReset > 0) {
                    galleryReset--;
                    // alert('Setting Timeout for Gallery Fade');
                    setTimeout(fadeOutGallery, 500);
                }
            }
        }
    }