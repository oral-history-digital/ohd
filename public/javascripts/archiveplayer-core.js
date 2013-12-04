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
  this.archiveConfig = {};
  this.config = {};
  this.container = container;
  this.player = jwplayer(container);
  this.currentSegment = null;
  this.currentSection = null;
  this.currentVolume = 80;
  this.savedVolume = 80;
  this.volumeWidth = null;
  this.slidesControllers = {};
};

ArchivePlayer.prototype.setup = function(setupConfig, setupArchiveConfig) {
    __archivePlayerPlaying = this;
    this.config = setupConfig;
    this.archiveConfig = Object.clone(setupArchiveConfig);
    /* this.archiveConfig is not carried over to the archiveplayer(container) object
       instead, it seems to be discarded. Need to attach variables directly to player.
     */
    this.player.viewerStartPosition = this.archiveConfig.position;
    if(this.player.viewerStartPosition > 0) {
        this.player.initialSeek = true;
    }
    this.config["segments.listener"] = "__archivePlayerGlobalSegmentsListener";
    this.config["segments.container"] = this.container;
    if(this.archiveConfig.segmentFile) {
        this.config['segments.file'] = this.archiveConfig.segmentFile;
    }
    if(this.archiveConfig['onSegment']) {
        this.onSegment = this.archiveConfig['onSegment'];
    }
    this.config.events = {
        onReady: function() {
            var playerModule = archiveplayer(this.container);
            playerModule.goToStartPosition();
            playerModule.player.setMute(false);
            playerModule.changeMuteImage(false);
        }
    };
    this.player.setup(this.config);
    this.player.onPlay(function() {
        __archivePlayerPlaying = true;
    });
    this.player.onPlaylistItem(function(event) {
        // on the player, container seems to be the object directly, so let's catch both id and object:
        var containerId = (typeof this.container == 'string') ? this.container : this.container.id
        var itemSelector = document.getElementById(containerId + "-item-selector");
        if(itemSelector) {
            itemSelector.selectedIndex = event.index;
        }
    });
    this.player.onMute(function(event) {
        this.changeMuteImage(false);
    });
};

/* Standard Control Wrapper Functions */
ArchivePlayer.prototype.pause = function(state) {
    this.player.pause(state);
    return this;
};
ArchivePlayer.prototype.play = function(state) {
    this.player.play(state);
    return this;
};
ArchivePlayer.prototype.getState = function() {
    return this.player.getState();
};
ArchivePlayer.prototype.playlistItem = function(index) {
    this.player.playlistItem(index);
    return this;
};
ArchivePlayer.prototype.setFullscreen = function(state) {
    this.player.setFullscreen(state);
    return this;
};
ArchivePlayer.prototype.setMute = function(state) {
    this.player.setMute(state);
    return this;
};
ArchivePlayer.prototype.stop = function() {
    this.player.stop();
    return this;
};

/* Seeking functions also for segment-based seeking */
ArchivePlayer.prototype.seek = function(item, position) {
    if (this.getItem() == item) {
        this.player.seek(position).play(true);
    } else {
        this.playlistItem(item).player.seek(position).play(true);
    }
    return this;
};

ArchivePlayer.prototype.seekNextSegment = function() {
    var nextBegin = this.currentSegment['nextBegin'];
    var previousBegin = this.currentSegment['previousBegin'];
    if (nextBegin === null && previousBegin === null) {
        var start = this.player.getPlaylistItem()['start'];
        this.player.seek((start ? start : 0));
    } else if (nextBegin === null) {
        this.player.playlistNext();
    } else {
        this.player.seek(nextBegin);
    }
    return this;
};

ArchivePlayer.prototype.seekPreviousSegment = function() {
    var previousBegin = this.currentSegment['previousBegin'];
    if (previousBegin === null) {
        var start = this.player.getPlaylistItem()['start'];
        this.player.seek((start ? start : 0));
    } else {
        this.player.seek(previousBegin);
    }
    return this;
};

/* Volume / Mute controls */

ArchivePlayer.prototype.changeMuteImage = function(hover) {
    var mute = this.player.getMute();
    var containerId = this.container + '-mute-image';
    if(document.getElementById(containerId)) {
        var image = 'images.' + (mute ? 'mute' : 'unmute') + (hover ? 'Hover' : '');
        document.getElementById(containerId).src = this.archiveConfig[image];
    };
};

ArchivePlayer.prototype.setVolume = function(event) {
    if(!event) { event = window.event; }
    var containerId = this.id.sub('-volume','');
    var playerModule = archiveplayer(containerId);
    var percentage = Math.round((100 / playerModule.volumeWidth) * event.layerX);
    playerModule.player.setVolume(percentage);
    var bar = document.getElementById(containerId + '-volumebar');
    bar.style.width = Math.round((playerModule.volumeWidth / 100) * percentage) + "px";
    return this;
};

ArchivePlayer.prototype.toggleMute = function() {
    if(this.player.getMute() == true) {
        this.player.setMute(false);
    } else {
        this.player.setMute(true);
    }
    return this;
};

/* basic JW Player functions, events and variables */
ArchivePlayer.prototype.getPosition = function() {
    return this.player.getPosition();
};
ArchivePlayer.prototype.getPlaylist = function() {
    if(!this.__playlist) {
        this.__playlist = this.player.getPlaylist();
    }
    return this.__playlist;
};
ArchivePlayer.prototype.getItem = function() {
    var playList = this.getPlaylist();
    var pItem = this.player.getPlaylistItem();
    var pidx = playList.length;
    while(pidx--) {
        if(pItem.file == playList[pidx].file) {
            return pidx;
        }
    }
    return null;
};

/* Listeners */
ArchivePlayer.prototype.volumeClickListener = function() {
    var containerId = this.container + '-volume';
    this.volumeWidth = document.getElementById(containerId).width;
    document.getElementById(containerId).onclick = this.setVolume;
};

ArchivePlayer.prototype.activateSlidesFor = function(captionsContainer, attribute) {
    if(!this.slidesControllers[attribute]) {
        this.slidesControllers[attribute] = new ArchivePlayerSlidesController(captionsContainer, 'captions-slide');
    }
};

ArchivePlayer.prototype.segmentsListener = function(event) {
    this.currentSegment = event;
    if ((typeof this.onSegment) == 'function') {
        this.onSegment(event);
    }
    this.writeSegmentInformation(event);
    var section = event['segmentData']['section'];
    if(section) {
        if(this.currentSection != section) {
            var lastSection = this.currentSection;
            this.currentSection = section;
            this.sectionsListener(section, lastSection);
        }
    }
    return this;
};

ArchivePlayer.prototype.sectionsListener = function(currentSection, lastSection) {
    headings.markHeading(currentSection);
};

ArchivePlayer.prototype.writeSegmentInformation = function(event) {
    var segmentsContainer;
    var containerText;
    for (var att in event['segmentData']) {
        segmentsContainer = document.getElementById(this.container + "-segments-" + att);
        if (segmentsContainer) {
            if(this.slidesControllers[att]) {
                this.slidesControllers[att].showCaptions(event['segmentData'][att]);
            } else {
                containerText = event['segmentData'][att];
                segmentsContainer.innerHTML = (typeof(containerText) == 'undefined' ? '' : containerText);
            }
        }
    }
};

/* TODO: ensure onSegment is called after seeking */
ArchivePlayer.prototype.goToStartPosition = function() {
    if(this.player.viewerStartPosition > 0) {
        this.player.setMute(true).seek(this.player.viewerStartPosition).onTime(function(event) {
            if(this.initialSeek) {
                this.setMute(false).pause();
                this.initialSeek = false;
            }
        });
    }
};

/* Global segments listener for all players */
var __archivePlayerGlobalSegmentsListener = function(event) {
  archiveplayer(event['container']).segmentsListener(event);
};