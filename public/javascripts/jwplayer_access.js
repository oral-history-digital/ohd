// *****************************************************************************
// Settings
var player_cfg = {
  jwplayer_file:                        '/swf/player-4.6.535.swf',
  captions_plugin_file:                 '/swf/captions-10',
  streamer:                             'rtmp://stream03.cedis.fu-berlin.de/abcbe6deaec582258749fcd36da488ca',
  width:                                '400',
  height:                               '320',
  skin:                                 '/swf/stylish.swf',
  delay:                                500,
  elem_player:                          'mediaspace',
  elem_captions:                        'captions',
  elem_heading:                         'headings',
  call_position:                        ["$('timecode').innerHTML = parseInt(this.position);"],
  call_item:                            ["$('current_item').selectedIndex = this.item;"],
  call_state:                           [],
  call_captions:                        []
}
// *****************************************************************************


var jwplayer =                          "/swf/player-4.6.535.swf";
var plugin_captions =                   "/swf/captions-10";
var streamer =                          "rtmp://stream03.cedis.fu-berlin.de/abcbe6deaec582258749fcd36da488ca";
//var elem_captions =                     "mediaplayer_captions";
var elem_headings =                     "mediaplayer_headings";
var elem_mainheading_prefix =           "mediaplayer_mainheading_";
var elem_subheading_prefix =            "mediaplayer_subheading_";
var mediaplayer_delay_before_seeking =  500;



var Player = Class.create({
  initialize: function(player) {
    //for(var i in args) { player_cfg[i] = args[i]; }
    this.cfg = player_cfg;
    this.player = player;
    this.state = null;
    this.item = null;
    this.position = null;
    this.caption = null;
    this.translate_captions = false;
    this.marked_mainheading = null;
    this.marked_subheading = null;
    this.loadListeners();
  },
  calledByListener: function(call_listener) {
    for(var i in player_cfg[call_listener]) { eval(player_cfg[call_listener][i])(); }
  },
  captionsListener: function(caption) {
    this.caption = new Caption(caption);
    this.showCaptions();
  },
  changeItem: function(item) {
    if(item != this.item) { this.player.sendEvent('ITEM', item) }
  },
  durationOfAllItems: function() {
    
  },
  durationOfCurrentItem: function() {
    
  },
  durationOfItem: function(item) {

  },
  getItem: function() {
    return this.item;
  },
  getPosition: function() {
    return this.position;
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
    //for(var i in player_cfg['call_item']) { eval(player_cfg['call_item'][i])(); }
  },
  loadListeners: function() {
    _this = this;
    this.player.addModelListener("STATE", "_this.stateListener");
    this.player.addModelListener("TIME", "_this.positionListener");
    this.player.addControllerListener("ITEM", "_this.itemListener");
  },
  pause: function() {
    if(this.isPlaying()) { this.player.sendEvent('PLAY'); }
  },
  play: function() {
    if(!this.isPlaying()) { this.player.sendEvent('PLAY'); }
  },
  positionListener: function(obj) {
    this.position = obj.position;
    if(this.position % 1 == 0) {
      this.calledByListener('call_position');
      $(elem_mainheading_prefix + this.item + "_" + this.position).setStyle({fontWeight: 'bold'});
      $(elem_mainheading_prefix + this.item + "_" + this.position).scrollIntoView(true);
    }
  },
  scrollToHeading: function(heading_id) {
    alert($(heading_id).getHeight());
  },
  seek: function(item, position) {
    this.changeItem(item);
    setTimeout(this.seekPosition.bind(this, position), player_cfg['delay']);
  },
  setTranslateCaptions: function(translate_captions) {
    this.translate_captions = translate_captions;
    setTimeout(this.showCaptions.bind(this), player_cfg['delay']);
  },
  showCaptions: function() {
    $(player_cfg['elem_captions']).innerHTML = this.translate_captions ? this.caption.getTranslatedText() : this.caption.getText();
  },
  showSubheadings: function(mainheading) {
    $('subheadings_for_' + mainheading).toggle();
  },
  stateListener: function(obj) {
    this.state = obj.newstate;
  },
  stop: function() {
    this.player.sendEvent('STOP');
  },
  seekPosition: function(position) {    
    this.player.sendEvent('SEEK', position);
  }
})

var JWPlayer = Class.create({
  initialize: function(file) {
    this.jwplayer = new SWFObject(player_cfg['jwplayer_file'], 'player', player_cfg['width'], player_cfg['height'], '10');
    this.jwplayer.addParam('allowfullscreen','true');
		this.jwplayer.addParam('allowscriptaccess','always');
		this.jwplayer.addParam('seamlesstabbing','true');
		this.jwplayer.addParam('wmode','opaque');
    this.jwplayer.addVariable('streamer', player_cfg['streamer']);
    this.jwplayer.addVariable('file', file);
    this.jwplayer.addVariable('plugins', '/jwplayer/captions-10');
    this.jwplayer.addVariable('captions.listener', 'mediaplayer.captionsListener');
  }
});

var Caption = Class.create({
  initialize: function(caption) {
    this.text = caption.replace(/\[(\/{0,1})orig\]/g, "");
    this.text = this.text.replace(/\[deu\].*\[\/deu\]/g, "");
    this.translated_text = caption.replace(/\[orig\].*\[\/orig\]/, "");
    this.translated_text = this.translated_text.replace(/\[(\/{0,1})deu\]/g, "");
  },
  getText: function() {
    return this.text;
  },
  getTranslatedText: function() {
    return this.translated_text;
  }
});

function abc() {
  alert("HW");
}

// Playing?
var playing;
playing = false;

// Original (false = Translation)
var orig;
orig = true;

var currentText;
currentText = "";

var currentItem;
var currentPosition = 0;

// aktuell markierte Überschrift
var marked_heading = "0";

function playerJumpTo(playlistitem, timecode_sec) {
	player.sendEvent('ITEM', playlistitem);
	player.sendEvent('PLAY');
	player.sendEvent('SEEK', timecode_sec);
	player.sendEvent('PLAY');
}

// Ohne Sonderfälle, z.B. mehrere Sprecher gleichzeitig
function changeSpeaker(x) {
	if(x == "I:") {
		gid('speaker').innerHTML = "Alexander von Plato";
	} else if(x == "P:") {
		gid('speaker').innerHTML = "Reinhard Florian";
	} else {
		
	}
}

function itemListener(obj) {
  currentItem = obj.index;
  document.Preview.change_tape.selectedIndex = obj.index;
}

function positionListener(obj) {
	currentPosition = obj.position;
    highlightHeading(currentItem, currentPosition);
    //document.Preview.tc.value = parseInt(currentPosition);
    //document.Preview.tc.value = player.getPlaylist()[2].duration;
}

function stateListener(obj) {
  currentState = obj.newstate;
  if(currentState == "PLAYING") {
    playing = true;
  } else {
    playing = false;
  }
}

function printPlaylistData() {
	var plst = null;
	plst = player.getPlaylist();
	if (plst) {
		var txt = '';
		for(var itm in plst) { 
			txt += '<li>'+itm+':</li>';
			txt += '<ul>';
			txt += '<li>'+plst[itm].title+'</li>';
			txt += '<li>'+plst[itm].author+'</li>';
			txt += '<li>'+plst[itm].file+'</li>';
			txt += '</ul><br>';
		}
		var tmp = document.getElementById("plstDat");
		if (tmp) { tmp.innerHTML = txt; }
	} else {
		setTimeout("printPlaylistData()",100);
	}	
}

function seek(tt_sec) {
    player.sendEvent('SEEK', tt_sec);
}

function jumpAndPlay(item, tt_sec) {

  if(currentItem != item) {
    player.sendEvent('ITEM', item);
  }

  if(playing) { player.sendEvent('SEEK', tt_sec); }
  else {
    player.sendEvent('PLAY');
    window.setTimeout("seek('"+tt_sec+"')", 1000);
    /*player.sendEvent('SEEK', tt_sec);*/
   }
}

function highlightHeading(item, tt_sec) {
    for(i=tt_sec; i>=0; i--) {
        id = item + "_" + i;
        if($(id)) {
            if(document.getElementById(marked_heading)) { document.getElementById(marked_heading).style.fontWeight = "normal"; }
            document.getElementById(id).style.fontWeight = "bold";
            marked_heading = id;
            break;
        }
        if(i == 0 && item > 0) {
            item--;
            i = 3000; //verbessern!
        }
        if(i == 0 && item == 0) {
            if(document.getElementById(marked_heading)) { document.getElementById(marked_heading).style.fontWeight = "normal"; }
        }
    }
}

function showCaptions(txt) {
  
    if(orig) {
        txt = txt.replace(/\[deu\].*\[\/deu\]/, "");
        txt = txt.replace(/\[(\/{0,1})orig\]/g, "");
    } else {
        txt = txt.replace(/\[orig\].*\[\/orig\]/, "");
        txt = txt.replace(/\[(\/{0,1})deu\]/g, "");
    }

    $('captions').innerHTML = txt;
  
}

function changeLanguage(is_orig) {
  orig = is_orig;
  showCaptions(currentText);
}

function accessibilityCaptions(txt)
{
  /*
	changeSpeaker(txt.substr(0,2));
	txt = txt.replace(/P:/g, "");
	txt = txt.replace(/I:/g, "");
  */
  //txt = txt.replace(/\[b\]/g, "<i style='font-size: 95%;'>");
  //txt = txt.replace(/\[\/b\]/g, "</i>");
  
  currentText = txt;
  showCaptions(txt);
}

function gid(name)
{
	return document.getElementById(name);
}