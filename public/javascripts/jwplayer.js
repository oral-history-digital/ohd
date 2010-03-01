
var player_cfg = {
  jwplayer_file:                        'player.swf',
  captions_plugin_file:                 'captions.swf',

  // Streaming Server
  streamer:                             'rtmp://stream03.cedis.fu-berlin.de/abcbe6deaec582258749fcd36da488ca',

  // Breite des Player-Fensters, ggf. inkl. Playlist
  width:                                '400',

  // Hoehe des Player-Fensters, ggf. inkl. Steuerbuttons und Playlist
  height:                               '320',

  // Skin-Datei (swf)
  skin:                                 '',

  backcolor:                            '',

  frontcolor:                           '',

  lightcolor:                           '',
  playlist:                             'none', // 'none', 'bottom', 'over', 'right'
  playlistsize:                         '80',

  startItem:                            null,
  startPosition:                        null,
  startTranslation:                    null,

  allow_fullscreen:                     'true',

  // Verzoegerung, die gebraucht wird, wenn z.B. an eine Position in einem
  // anderen Band geprungen wird, 500 (= halbe sec.) sollte OK sein
  delay:                                500,

  // Callback für Beginn des Abspielmodus
  whilePlaying:                         function(){},

  // Callback für Pause
  onPause:                              function(){},

  // Objekt-ID des Players
  player_id:                            'player',

  // ID des HTML-Content-Elements, in dem Player dargestellt wird
  content_id:                           'mediaspace',

  // ID des HTML-Content-Elements, in dem Transkription angezeigt wird
  captions_id:                          'captions',

  slide_class:                          null,

  // auszufuehrender Code bei Veraenderungen der Interview-Position
  // in Sekunden
  call_position:                        "",

  // auszufuehrender Code bei Wechsel des Interview-Bandes
  call_item:                            "$(this.cfg['player_id'] + '_item').selectedIndex = this.item;",

  // auszufuehrender Code bei Veraenderungen des Player-Status�
  // (PLAYING, PAUSED usw.)
  call_state:                           "",

  onPlayerReady:                        function(){},
  onVolume:                             function(){},
  onMute:                               function(){}
};
// *****************************************************************************


// unerheblich, wenn nur ein Player pro Seite dargestellt wird
var players = new Array();
var current_player = null;

// wird IMMER vom JWPlayer aufgerufen, sobald er geladen ist
function playerReady(player) {
  players[player.id].cfg['player_id'] = player.id;
  players[player.id].player = $(player.id);
  current_player = players[player.id];
  players[player.id].player.addModelListener("STATE", "stateListener");
  players[player.id].player.addModelListener("TIME", "positionListener");
  players[player.id].player.addControllerListener("ITEM", "itemListener");
  players[player.id].player.addControllerListener("VOLUME", "volumeListener");
  players[player.id].player.addControllerListener("MUTE", "muteListener");
  if(current_player) { players[player.id].playerReady(); };
};

function stateListener(obj) {
  if(current_player) { current_player.stateListener(obj)};
};

function positionListener(obj) {
  if(current_player) { current_player.positionListener(obj)};
};

function itemListener(obj) {
  if(current_player) { current_player.itemListener(obj)};
};

function volumeListener(obj) {
  if(current_player) { current_player.volumeListener(obj)};
};

function muteListener(obj) {
  if(current_player) { current_player.muteListener(obj)};
};

function captionsListener(obj) {
  if(current_player) { current_player.captionsListener(obj)};
};

// ausser Parameter "file" alles optional
var Player = Class.create({
  /*
   * initialize: function(file, cfg) {
   * var _this = this;
   * this.file = file;
   * this.cfg = player_cfg;
   * // Ueberschreiben der Standard-Konfiguration
   * for(attr in cfg) { if(this.cfg[attr] != undefined) { this.cfg[attr] = cfg[attr]; } }
   */
  initialize: function(file, cfg) {
    this.file = file;
    this.cfg = player_cfg;
    // Standard-Konfiguration ueberschreiben
    for(attr in cfg) { this.cfg[attr] = cfg[attr]; }
    if(typeof(player_id) == 'string') { this.cfg['player_id'] = player_id; }
    if(typeof(content_id) == 'string') { this.cfg['content_id'] = content_id; }
    players[this.cfg['player_id']] = this;

    this.jwplayer = new SWFObject(this.cfg['jwplayer_file'], this.cfg['player_id'], this.cfg['width'], this.cfg['height'], '9');
    this.jwplayer.addParam('allowfullscreen', this.cfg['allow_fullscreen']);
    this.jwplayer.addParam('allowscriptaccess', 'always');
    this.jwplayer.addParam('seamlesstabbing', 'true');
    this.jwplayer.addParam('wmode','opaque');
    this.jwplayer.addVariable('playlist', this.cfg['playlist']);
    this.jwplayer.addVariable('streamer', this.cfg['streamer']);
    this.jwplayer.addVariable('plugins', this.cfg['captions_plugin_file']);
    this.jwplayer.addVariable('captions.listener', 'captionsListener');
    this.jwplayer.addVariable('captions.state', false);
    this.jwplayer.addVariable('file', this.file);
    this.jwplayer.addVariable('skin', this.cfg['skin']);
    this.jwplayer.addVariable('backcolor', this.cfg['backcolor']);
    this.jwplayer.addVariable('frontcolor', this.cfg['frontcolor']);
    this.jwplayer.addVariable('lightcolor', this.cfg['lightcolor']);
    this.jwplayer.addVariable('id', this.cfg['player_id']);
    if(this.cfg['startItem'] != null) { this.jwplayer.addVariable('autostart', true); }
    this.jwplayer.write(this.cfg['content_id']);

    this.player = null;
    this.state = null;
    this.item = null;
    this.position = null;
    this.volume = '90';
    this.mute = false;
    this.playCallback = this.cfg['whilePlaying'];
    this.pauseCallback = this.cfg['onPause'];
    this.caption = null;
    this.captionContainer = $(this.cfg['captions_id']);
    this.slide_class = this.cfg['slide_class'];
    this.useSlides = this.slide_class != null;
    this.currentSlide = null;
    this.slideIndex = 0;
    if (this.useSlides) {
        this.slides = $$('#' + this.cfg['captions_id'] + ' .' + this.slide_class);
        if (this.slides.length < 3) {
            // a minimum of 3 slides is needed
            this.useSlides = false;
        } else {
            this.slides.each(function(slide){
                slide.setStyle({ opacity: 0, display: 'none' });
            })
        }
    }

    this.translated_captions = this.cfg['startTranslation'];
    this.marked_mainheading = null;
    this.marked_subheading = null;
  },

  calledByListener: function(call_listener) {
    eval(this.cfg[call_listener])();
  },

  captionsListener: function(obj) {
    if(!this.captionContainer) { this.captionContainer = $(this.cfg['captions_id']);}
    this.caption = obj.caption;
    this.showCaptions();
    eval(this.cfg['onCaptions']);
  },

  changeItem: function(item) {
    if(item != this.item) { this.player.sendEvent('ITEM', item) }
  },

  checkStartParams: function() {
    this.seek(this.cfg['startItem'], this.cfg['startPosition'], true);
    if(this.cfg['start_language'] != null) { this.translateCaptions(this.cfg['start_language']); }
  },

  isPlaying: function() {
    return this.state == "PLAYING" ? true : false;
  },

  isTranslatedCaptions: function() {
    return this.translated_captions;
  },

  itemListener: function(obj) {
    this.item = obj.index;
    this.calledByListener('call_item');
  },

  loadListeners: function() {
    var _this = this;
    this.player.addModelListener("STATE", "_this.stateListener");
    this.player.addModelListener("TIME", "_this.positionListener");
    this.player.addControllerListener("ITEM", "_this.itemListener");
  },

  muteListener: function(obj) {
    this.mute = obj.state;
    if(this.cfg['onMute']) { eval(this.cfg['onMute']); }  
  },

  pause: function() {
    if(this.isPlaying()) { this.player.sendEvent('PLAY'); }
  },

  play: function() {
    if(!this.isPlaying()) { this.player.sendEvent('PLAY'); }
  },

  playerReady: function() {  
    //this.player.sendEvent('MUTE', true);
    this.setVolume('90');
    eval(this.cfg['onPlayerready']);  
  },

  positionListener: function(obj) {
    this.position = obj.position;
    //current_player = this;

    // wenn Player geladen und (automatisch) gestartet ist, Sprung zu den
    // Start-Parametern, falls angegeben
    if((typeof(this.position) == 'number') && (this.cfg['startItem'] != null)) {
      this.checkStartParams();
      this.cfg['startItem'] = null;
      this.cfg['startPosition'] = null;
      this.cfg['startTranslation'] = null;
    }

    // wird nur jede Sekunde aufgerufen, nicht jede 1/100 sec.
    // Anwendungsbeispiel: Markierung der aktuellen Ueberschrift
    if(this.position % 1 == 0) {
      this.playCallback();
      this.calledByListener('call_position');
    }
  },

  seek: function(item, position, pause) {
    this.changeItem(item);
    setTimeout(this.seekPosition.bind(this, position, pause), this.cfg['delay']);
  },

  seekPosition: function(position, pause) {
    this.player.sendEvent('SEEK', position);
    if(pause) {
      setTimeout(this.pause.bind(this), this.cfg['delay']);
    }
  },

  setMute: function(state) {
    this.mute = state;
    this.player.sendEvent('MUTE', state);
  },

  setVolume: function(percentage) {
      this.volume = percentage;
      this.player.sendEvent('VOLUME', percentage);
  },

  nextSlideIndex: function() {
      var nextIndex = this.slideIndex + 1;
      if(nextIndex > this.slides.length -1) {
          nextIndex = 0;
      }
      return nextIndex;
  },

  previousSlideIndex: function() {
      var prevIndex = this.slideIndex -1;
      if(prevIndex < 0) {
          prevIndex = this.slides.length -1;
      }
      return prevIndex;
  },

  showCaptions: function() {
    if(this.captionContainer) {
      if(this.useSlides) {
          // insert into next slide
          var nextIndex = this.nextSlideIndex();
          this.slides[nextIndex].innerHTML = this.caption;
          new Effect.Fade(this.slides[this.slideIndex], { duration: 0.25 });
          new Effect.Appear(this.slides[nextIndex], { duration: 0.25, queue: 'end' });
          this.slideIndex = nextIndex;
      } else {
          // simple caption exchange
          this.captionContainer.innerHTML = this.caption;
      }
    }
  },

  scrollBack: function() {
      if(this.useSlides) {
          var prevIndex = this.previousSlideIndex();
          
      }
  },

  scrollForward: function() {
      if(this.useSlides) {

      }
  },

  stateListener: function(obj) {
    this.state = obj.newstate;
    if(this.state == 'PLAYING') {
        this.playCallback();
    } else {
        if((this.state == 'PAUSED') || (this.state == 'IDLE')) {
            this.pauseCallback();   
        }
    }
    this.calledByListener('call_state');
  },

  stop: function() {
    this.player.sendEvent('STOP');
  },

  toogleMute: function() {
    this.mute = !this.mute;
    this.player.sendEvent('MUTE', this.mute);
  },

  translateCaptions: function(translate_captions) {
    this.translated_captions = translate_captions;
    if(this.translated_captions) {
      this.captionContainer.removeClassName('captions_original');
      this.captionContainer.addClassName('captions_translation');
    } else {
      this.captionContainer.removeClassName('captions_translation');
      this.captionContainer.addClassName('captions_original');
    }
    // setTimeout(this.showCaptions.bind(this), this.cfg['delay']);
  },

  volumeListener: function(obj) {
    this.volume = obj.percentage;
    if(this.cfg['onVolume']) { eval(this.cfg['onVolume']); }
  }
});



// Ueberschriften

var marked_heading = null;

var scrollStart = 0;

function showSubheadings(main) {
  if($('subheadings_for_' + main) != undefined) {
    $('subheadings_for_' + main).toggle();
  }
}

function markHeading(item, position) {
  while(!$("heading_" + item + "_" + position)) {
    if(position == 0 && item > 0) {
      position = 10000;
      item--;
    } else if(position == -1 && item == 0) {
      var founded_heading = "headings_begin";
      break;
    } else {
      position--;
    }
  }

  if(founded_heading != "headings_begin") {
    var founded_heading = "heading_" + item + "_" + position;
  }

  if(marked_heading == founded_heading) { return; }

  if(scrollStart == 0) {
      // initialize scrollStart
      scrollStart = $('headings').down('table').scrollTop + ($('headings').getHeight() * 2 / 3);
  }

  var previous = $(marked_heading);
  var new_heading = $(founded_heading);

  if(previous) { previous.removeClassName('current'); }
  if(new_heading) {
      // mark the current heading
      new_heading.addClassName('current');
      // smooth scroll to the current heading
      var newOffset = new_heading.offsetTop - scrollStart;
      if(new_heading.hasClassName('subheading')) {
          // add the mainheading's offsetTop
          var previousHeading = new_heading.up('.mainheading');
          if(previousHeading) {
              newOffset = newOffset + previousHeading.offsetTop;
          }
      }
      if(newOffset < 0) { newOffset = 0; }
      new Effect.Tween('headings', $('headings').scrollTop, newOffset, { duration: 0.6 }, 'scrollTop');
  }
  marked_heading = founded_heading;
}