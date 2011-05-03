var __archivePlayers = {};
var __archivePlayerPlaying = false;
var __archivePlayerFirst = null;

var archiveplayer = function(container) {
  var container = container;
  if (typeof(container) == 'undefined') {
    if (__archivePlayerFirst === null) {
      container = 0;
    } else {
      container = __archivePlayerFirst;
    }
  }

  if (typeof(__archivePlayers[container]) == 'undefined') {
    __archivePlayers[container] = new ArchivePlayer(container);
    if (__archivePlayerFirst === null) {
      __archivePlayerFirst = container;
    }
  }

  return __archivePlayers[container];
};

var ArchivePlayer = function(container) {
  var archiveConfig = {};
  var config = {};
  var container = container;
  var currentItem = 0;
  var currentSegment = null;
  var currentSection = null;
  var currentVolume = 80;
  var savedVolume = 80;
  var firstStart = true;
  var volumeWidth = null;
  var slidesControllers = {};

  var onSegment = function(event) {
    var method = archiveConfig.onSegment;
    method(event);
  };

  var sectionsListener = function(currentSection, lastSection) {
    headings.markHeading(currentSection);
  };

  this.activateSlidesFor = function(captionsContainer, attribute) {
    if($) {
      slidesControllers[attribute] = new ArchivePlayerSlidesController(captionsContainer, 'captions-slide');
    }
  };

  this.seek = function(item, position) {
    if (currentItem == item) {
      jwplayer(container).seek(position).play(true);
    } else {
      jwplayer(container).playlistItem(item).seek(position).play(true);
    }
    return this;
  };

  this.seekNextSegment = function() {
    var nextBegin = currentSegment['nextBegin'];
    var previousBegin = currentSegment['previousBegin'];
    if (nextBegin === null && previousBegin === null) {
      var start = jwplayer(container).getPlaylistItem()['start'];
      jwplayer(container).seek((start ? start : 0));
    } else if (nextBegin === null) {
      jwplayer(container).playlistNext();
    } else {
      jwplayer(container).seek(nextBegin);
    }
    return this;
  };

  this.seekPreviousSegment = function() {
    var previousBegin = currentSegment['previousBegin'];
    if (previousBegin === null) {
      var start = jwplayer(container).getPlaylistItem()['start'];
      jwplayer(container).seek((start ? start : 0));
    } else {
      jwplayer(container).seek(previousBegin);
    }
    return this;
  };

  this.segmentsListener = function(event) {
    currentSegment = event;
    if (archiveConfig.onSegment) {
      onSegment(event);
    }
    writeSegmentInformation(event);
    var section = event['segmentData']['section'];
    if(section) {
      if(currentSection != section) {
        var lastSection = currentSection;
        currentSection = section;
        sectionsListener(section, lastSection);
      }
    }
    return this;
  };

  this.setup = function(setupConfig, setupArchiveConfig) {
    __archivePlayerPlaying = container;
    config = setupConfig;
    archiveConfig = setupArchiveConfig;
    if(archiveConfig.segmentFile) {
      config['segments.file'] = archiveConfig.segmentFile;
    }
    config["segments.listener"] = "__archivePlayerGlobalSegmentsListener";
    config["segments.container"] = container;
    config["events.onReady"] = "function() { alert('ready!'); }";
    jwplayer(container).setup(config);
    jwplayer(container).onReady(function() {
      if(archiveConfig.position) { goToStartPosition(); }
      changeMuteImage(false);
    });
    jwplayer(container).onPlay(function() {
      __archivePlayerPlaying = container;
    });
    jwplayer(container).onPlaylistItem(function(event) {
      currentItem = event.index;
      var itemSelector = document.getElementById(container + "-item-selector");
      if(itemSelector) {
        itemSelector.selectedIndex = event.index;
      }
    });
    jwplayer(container).onMute(function(event) {
      changeMuteImage(false);
    });
    jwplayer(container).onVolume(function(event) {
      currentVolume = event.volume;
      if(volumeWidth) {
        var containerId = container + '-volumebar';
        if(document.getElementById(containerId)) {
          document.getElementById(containerId).style.width = Math.round((volumeWidth / 100) * event.volume) + "px";
        };
      }
    });
    
    this.jwplayer = jwplayer(container);
    return this;
  };

  this.changeMuteImage = function(hover) {
    changeMuteImage(hover);
    return this;
  };

  var changeMuteImage = function(hover) {
    var mute = jwplayer(container).getMute();
    var containerId = container + '-mute-image';
    if(document.getElementById(containerId)) {
      var image = 'images.' + (mute ? 'mute' : 'unmute') + (hover ? 'Hover' : '');
      document.getElementById(containerId).src = archiveConfig[image];
    };
  };

  var goToStartPosition = function() {
    jwplayer(container).setMute(true).seek(archiveConfig.position).onTime(function(event) {
      if(firstStart == true && event.position > 0) {
        jwplayer(container).pause().setMute(false);
        firstStart = false;
      }
    });
  };

  this.setVolume = function(event) {
    if(!event) { event = window.event; }
    var percentage = Math.round((100 / volumeWidth) * event.layerX);
    jwplayer(container).setVolume(percentage);
    return this;
  };

  this.toggleMute = function() {
    if(jwplayer(container).getMute() == true) {
      jwplayer(container).setMute(false);
    } else {
      jwplayer(container).setMute(true);
    }
    return this;
  };

  this.volumeClickListener = function() {
    var containerId = container + '-volume';
    volumeWidth = document.getElementById(containerId).width;
    document.getElementById(containerId).onclick = this.setVolume;
  };

  var writeSegmentInformation = function(event) {
    var segmentsContainer;
    var containerText;
    for (var att in event['segmentData']) {
      segmentsContainer = document.getElementById(container + "-segments-" + att);
      if (segmentsContainer) {
        if(slidesControllers[att]) {
          slidesControllers[att].showCaptions(event['segmentData'][att]);
        } else {
          containerText = event['segmentData'][att];
          segmentsContainer.innerHTML = (typeof(containerText) == 'undefined' ? '' : containerText);
        }
      }
    }
  };

  /* basic JW Player functions, events and variables */
  this.getPosition = function() {
    return jwplayer(container).getPosition();
  };
  this.pause = function(state) {
    jwplayer(container).pause(state);
    return this;
  };
  this.play = function(state) {
    jwplayer(container).play(state);
    return this;
  };
  this.playlistItem = function(index) {
    jwplayer(container).playlistItem(index);
    return this;
  };
  this.setFullscreen = function(state) {
    jwplayer(container).setFullscreen(state);
    return this;
  };
  this.setMute = function(state) {
    jwplayer(container).setMute(state);
    return this;
  };
  this.stop = function() {
    jwplayer(container).stop();
    return this;
  };
};

/* Global segments listener for all players */
function __archivePlayerGlobalSegmentsListener(event) {
  archiveplayer(event['container']).segmentsListener(event);
}