var playerDefaults = {
  jwplayerFile                : 'player.swf',
  captionsPluginFile          : 'captions.swf',
  qualityPluginFile           : '',
  additionalPluginFiles       : '',

  id                          : '',
  jwplayerSpace               : 'mediaspace',
  captionsSpace               : '',
  slideClass                  : null,

  playlistfile                : '',
  streamer                    : 'rtpm://stream03.cedis.fu-berlin.de/zwangsarbeit-archiv2',

  width                       : '400',
  height                      : '320',
  playlist                    : 'none', // 'none', 'bottom', 'over', 'right'
  playlistsize                : '80',

  skin                        : '',
  backcolor                   : '',
  frontcolor                  : '',
  lightcolor                  : '',

  allowfullscreen             : true,
  autostart                   : false,

  startItem                   : '',
  startPosition               : '',

  captionsLanguage            : 'original',

  headingsTable               : null,

  qualityToggler              : false,
  extendedControlbar          : false,
  extendedControlbarSpace     : 'extendedControlbar',

  onCaptions                  : function(){},
  onItem                      : function(){},
  onMute                      : function(){},
  onPause                     : function(){},
  onPlayerReady               : function(){},
  onState                     : function(){},
  onVolume                    : function(){},
  whilePlaying                : function(){},

  delay                       : 750
}

var players = new Array();
var currentPlayer = null;

// wird vom JWPlayer aufgerufen, sobald er geladen ist
function playerReady(player) {
  players[player.id].cfg.id = player.id;
  players[player.id].player = $(player.id);
  currentPlayer = null;
  currentPlayer = players[player.id];

  players[player.id].player.addModelListener("STATE", "stateListener");
  players[player.id].player.addModelListener("TIME", "positionListener");
  players[player.id].player.addControllerListener("ITEM", "itemListener");
  players[player.id].player.addControllerListener("VOLUME", "volumeListener");
  players[player.id].player.addControllerListener("MUTE", "muteListener");
  if(currentPlayer) { players[player.id].playerReady(); };

  eval(players[player.id].playerReadyCallback)();

  // volume and mute state from jwplayer cookies
  currentPlayer.setVolume(player.volume);
  currentPlayer.setMute(player.mute);

  currentPlayer.showQualityToggler();
  currentPlayer.showExtendedControlbar();
}

function stateListener(obj) {
  if(currentPlayer) { currentPlayer.stateListener(obj) };
};

function positionListener(obj) {
  if(currentPlayer) { currentPlayer.positionListener(obj) };
};

function itemListener(obj) {
  if(currentPlayer) { currentPlayer.itemListener(obj) };
};

function volumeListener(obj) {
  if(currentPlayer) { currentPlayer.volumeListener(obj) };
};

function muteListener(obj) {
  if(currentPlayer) { currentPlayer.muteListener(obj) };
};

function captionsListener(obj) {
  if(currentPlayer) { currentPlayer.captionsListener(obj) };
};

var Player = Class.create({
  initialize: function(file, cfg) {
    this.file = file;
    this.cfg = playerDefaults;
    for(var attr in cfg) { this.cfg[attr] = cfg[attr]; }
    players[this.cfg.id] = this;

    // adding plugin files
    var plugins = new Array();
    if(this.cfg.additionalPluginFiles) { plugins.push(this.cfg.additionalPluginFiles); }
    if(this.cfg.captionsPluginFile) { plugins.push(this.cfg.captionsPluginFile); }
    if(this.cfg.qualityPluginFile) { plugins.push(this.cfg.qualityPluginFile); }

    var playerParams = {
      'allowfullscreen'     : this.cfg.allowfullscreen,
      'allowscriptaccess'   : 'always',
      'seamlesstabbing'     : true
    }

    var playerVariables = {
      'autostart'           : this.cfg.autostart,
      'captions.listener'   : 'captionsListener',
      'captions.state'      : false,
      'file'                : this.file,
      'id'                  : this.cfg.id,
      'playlist'            : this.cfg.playlist,
      'plugins'             : plugins.join(","),
      'skin'                : this.cfg.skin,
      'streamer'            : this.cfg.streamer,
      'backcolor'           : this.cfg.backcolor,
      'frontcolor'          : this.cfg.frontcolor,
      'lightcolor'          : this.cfg.lightcolor
    }

    if(this.cfg.startItem) { playerVariables.autostart = true; }

    // creates and writes the JW Player
    this.jwplayer = new SWFObject(this.cfg.jwplayerFile, this.cfg.id, this.cfg.width, this.cfg.height, '10');
    for(var i in playerParams) { this.jwplayer.addParam(i, playerParams[i]); }
    for(var j in playerVariables) { this.jwplayer.addVariable(j, playerVariables[j]); }
    this.jwplayer.write(this.cfg.jwplayerSpace);

    this.player = null;
    this.state = null;
    this.item = null;
    this.position = null;
    this.volume = '90';
    this.mute = false;
    this.qualityTimer = null;
    this.extendedControlbarTimer = null;
    this.qualityToggler = this.cfg.qualityToggler;
    this.extendedControlbar = this.cfg.extendedControlbar;

    this.captionsCallback = this.cfg.onCaptions;
    this.muteCallback = this.cfg.onMute;
    this.volumeCallback = this.cfg.onVolume;
    this.playCallback = this.cfg.whilePlaying;
    this.pauseCallback = this.cfg.onPause;
    this.playerReadyCallback = this.cfg.onPlayerReady;

    this.registeredHeadingsTable = null;
    this.headingsTable = this.cfg.headingsTable;

    this.caption = null;
    this.captionContainer = $(this.cfg.captionsSpace);
    this.captionsLanguage = this.cfg.captionsLanguage;
    this.slideClass = this.cfg.slideClass;
    this.useSlides = this.slideClass != null;
    this.currentSlide = null;
    this.slideIndex = 0;
    if (this.useSlides) {
        this.slides = $$('#' + this.cfg.captionsSpace + ' .' + this.slideClass);
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
  },

  registerHeadingsTable: function(table) {
    this.registeredHeadingsTable = table;
  },

  calledByListener: function(call_listener) {
    eval(this.cfg[call_listener])();
  },

  captionsListener: function(obj) {
    if(!this.captionContainer) { this.captionContainer = $(this.cfg.captionsSpace);}
    this.caption = obj;
    if(!this.registeredHeadingsTable && (this.headingsTable != null))  {
        eval('this.registerHeadingsTable(' + this.headingsTable + ');');
    }
    if(this.registeredHeadingsTable != null) {
        this.registeredHeadingsTable.markHeading(this.caption.heading);
    }
    this.showCaptions();
    this.captionsCallback();
  },

  changeItem: function(item) {
    if(item != this.item) { this.player.sendEvent('ITEM', item); }
  },

  checkStartParams: function() {
    var startItem = this.cfg['startItem'];
    var startPosition = this.cfg['startPosition'] - 1;
    this.cfg['startItem'] = null;
    this.cfg['startPosition'] = null;
    this.seek(startItem, startPosition, true);
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
    eval(this.muteCallback)();
  },

  pause: function() {
    if(this.isPlaying()) { this.player.sendEvent('PLAY', 'false'); }
  },

  play: function() {
    if(!this.isPlaying()) { this.player.sendEvent('PLAY', 'true'); }
  },

  playerReady: function() {

  },

  positionListener: function(obj) {
    this.position = obj.position;

    // wenn Player geladen und (automatisch) gestartet ist, Sprung zu den
    // Start-Parametern, falls angegeben
    if((typeof(this.position) == 'number') && (this.cfg['startItem'] != null)) {
      this.checkStartParams();
      this.cfg['startItem'] = null;
      this.cfg['startPosition'] = null;
      this.cfg['startCaptionsLanguage'] = null;
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
      setTimeout(this.pause.bind(this), 1000);
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
    if(this.captionContainer && this.caption) {
      var captionText = "";
      if(this.captionsLanguage) {
        captionText = this.caption.lang[this.captionsLanguage];
      } else {
        captionText = this.caption.text;
      }
      // empty string if undefined
      if(!captionText) { captionText = ""; }
      if(this.useSlides) {
          // insert into next slide
          var nextIndex = this.nextSlideIndex();
          this.slides[nextIndex].innerHTML = captionText;
          new Effect.Fade(this.slides[this.slideIndex], { duration: 0.25 });
          new Effect.Appear(this.slides[nextIndex], { duration: 0.25, queue: 'end' });
          this.slideIndex = nextIndex;
      } else {
          // simple caption exchange
          this.captionContainer.innerHTML = captionText;
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

  setCaptionsLanguage: function(language) {
    this.captionsLanguage = language;
    this.showCaptions();
  },

  showExtendedControlbar: function() {
    if(this.extendedControlbar) {
      clearTimeout(this.extendedControlbarTimer);
      new Effect.Appear(this.cfg.extendedControlbarSpace, { duration: 0.25 });
      this.extendedControlbarTimer = setTimeout(this.hideExtendedControlbar.bind(this), 3000);
    }
  },

  hideExtendedControlbar: function() {
    if($(this.cfg.extendedControlbarSpace) != null) {
      new Effect.Fade(this.cfg.extendedControlbarSpace, { duration: 0.25 });
    }
  },

  showQualityToggler: function() {
    if(this.qualityToggler) {
      //this.hideQualityToggler();
      clearTimeout(this.qualityTimer);
      //$(this.cfg.jwplayerSpace).insert('<div id="qualityToggler">TEST</div>');
      /*$('mediaContainer').insert('<div id="qualityToggler">'+togglerContent+'</div>');
      $('qualityToggler').observe('click', function(){
        toggleMedia();
      });*/
      new Effect.Appear('qualityToggler', { duration: 0.25 });
      if(this.cfg.id.indexOf("high") >= 0) {
        $('qualityToggler-high').addClassName('active');
        $('qualityToggler-low').removeClassName('active');
      } else {
        $('qualityToggler-high').removeClassName('active');
        $('qualityToggler-low').addClassName('active');
      }
      this.qualityTimer = setTimeout(this.hideQualityToggler.bind(this), 3000);
    }
  },

  hideQualityToggler: function() {
    if($('qualityToggler') != null) {
      new Effect.Fade('qualityToggler', { duration: 0.25 });
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

  toggleMute: function() {
    this.mute = !this.mute;
    this.player.sendEvent('MUTE', this.mute);
  },

  toggleQuality: function() {
    this.quality = !this.quality;
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
    eval(this.volumeCallback)();
  }
});


