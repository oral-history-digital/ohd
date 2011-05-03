
package com.longtailvideo.plugins.hd {
	
	import com.longtailvideo.jwplayer.events.MediaEvent;
	import com.longtailvideo.jwplayer.events.PlayerStateEvent;
	import com.longtailvideo.jwplayer.events.PlaylistEvent;
	import com.longtailvideo.jwplayer.model.IPlaylist;
	import com.longtailvideo.jwplayer.model.PlaylistItem;
	import com.longtailvideo.jwplayer.player.IPlayer;
	import com.longtailvideo.jwplayer.player.PlayerState;
	import com.longtailvideo.jwplayer.plugins.IPlugin;
	import com.longtailvideo.jwplayer.plugins.PluginConfig;
	import com.longtailvideo.jwplayer.utils.Configger;
	
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.events.Event;
	
	
	/**
	 * HD Plugin; implements an HD toggle.
	 **/
	public class HD extends MovieClip implements IPlugin {
		
		[Embed(source="../../../../../assets/controlbar.png")]
		private const ControlbarIcon:Class;
		[Embed(source="../../../../../assets/dock.png")]
		private const DockIcon:Class;
		
		/** Reference to the player. **/
		private var _player:IPlayer;
		/** Reference to the plugin's configuration **/
		private var _config:PluginConfig;
		/** Reference to the dock _button. **/
		private var _button:MovieClip;
		/** Reference to the clip on stage. **/
		private var _icon:DisplayObject;
		/** The current playlist item **/
		private var _currentItem:PlaylistItem;
		/** The current position inside a video. **/
		private var _position:Number = 0;
		/** Indicates that the HD Plugin just swapped the video **/
		private var _swapped:Boolean = false;
		/** Text when HD is on **/
		private var _hdOn:String = 'is on'
		/** Text when HD is off **/
		private var _hdOff:String = 'is off'
		
		
		/** Constructor; nothing going on. **/
		public function HD():void {
		}
		
		
		/** The initialize call is invoked by the player. **/
		public function initPlugin(player:IPlayer, cfg:PluginConfig):void {
			_player = player;
			_config = cfg;
			if (String(config.state) == 'true') {
				config.state = true;
			} else {
				config.state = false;				
			}
			
			if (cfg.texton) { _hdOn = cfg.texton; }
			if (cfg.textoff) { _hdOff = cfg.textoff; }
			
			_player.addEventListener(MediaEvent.JWPLAYER_MEDIA_TIME, timeHandler);
			_player.addEventListener(PlaylistEvent.JWPLAYER_PLAYLIST_ITEM, itemHandler);
			_player.addEventListener(PlayerStateEvent.JWPLAYER_PLAYER_STATE, stateHandler);
			
			if (_player.config.dock) {
				if (_player.skin.getSkinElement('hd', 'dockIcon')) {
					_icon = _player.skin.getSkinElement('hd', 'dockIcon');
				} else {
					_icon = new DockIcon();
				}
				_button = _player.controls.dock.addButton(_icon, _hdOn, clickHandler);
			} else {
				if (_player.skin.getSkinElement('hd', 'controlbarIcon')) {
					_icon = _player.skin.getSkinElement('hd', 'controlbarIcon');
				} else {
					_icon = new ControlbarIcon();
				}
				_player.controls.controlbar.addButton(_icon, 'hd', clickHandler);
			}
			setUI();
		}
		
		
		/** Upon resize, check for fullscreen switches. Switch the state if so. **/
		public function resize(width:Number, height:Number):void {
			if (config.fullscreen && (_player.fullscreen != config.state && _player.state != PlayerState.IDLE)) {
				clickHandler();
			}
		}
		
		
		public function get config():PluginConfig {
			return _player.config.pluginConfig('hd');
		}
		
		
		public function get id():String {
			return _config.id;
		}
		
		
		/** Save the position inside a video. **/
		private function timeHandler(evt:MediaEvent):void {
			_position = evt.position;
		}
		
		/** HD _button is clicked, so change the video. **/
		private function clickHandler(evt:Event=null):void {
			config.state = !config.state;
			Configger.saveCookie(id + ".state", config.state);
			swapHandler();
			setUI();				
		}
		
		/** Set the HD _button state. **/
		private function setUI():void {
			if (config.file || (_currentItem && _currentItem.hasOwnProperty('hd.file'))) {
				if (!config.state) {
					if (_button) {
						_button.field.text = _hdOff;
						_button.field.alpha = 1;
						_icon.alpha = 1;
					} else {
						_icon.alpha = 0.3;
					}
				} else {
					_icon.alpha = 1;
					if (_button) {
						_button.field.alpha = 1;
						_button.field.text = _hdOn;
					}
				}
			} else {
				_icon.alpha = 0.3;
				if(_button) {
					_button.field.alpha = 0.3;
					_button.field.text = '---';
				}
			}
		}
		
		/** Updates the playlist with either the HD or default video. **/
		private function itemHandler(evt:Event=null):void {
			if (_currentItem != _player.playlist.currentItem) {
				if (_currentItem != null){
					resetItem();	
				}
				_currentItem = _player.playlist.currentItem;
				if (!_currentItem.hasOwnProperty('hd.originalfile')) {
					_currentItem['hd.originalfile'] = _currentItem.file;
					_currentItem['hd.originalstart'] = _currentItem.start;
					_currentItem['hd.originalstreamer'] = _currentItem.streamer;
				}
				// Prevents multiple item events from being fired when playlist is reloaded
				if (_swapped){
					_swapped = false;
				} else {
					var stateFile:String = stateFile();
					var stateStreamer:String = stateStreamer();
					if (stateFile){
						_player.playlist.currentItem['file'] = stateFile;
					}
					if (stateStreamer){
						_player.playlist.currentItem['streamer'] = stateStreamer;
					}
				}
			}
			setUI();
		}
		
		private function swapHandler():void{
			var swapFile:String = stateFile();
			if (swapFile) {
				if (_currentItem.file != swapFile) {
					var swapStreamer:String = stateStreamer();
					if (swapStreamer) {
						swap(swapFile, swapStreamer);
					} else {
						swap(swapFile);	
					}
				}
			}
			setUI();
		}
		
		private function stateHandler(evt:PlayerStateEvent):void {
			if (evt.newstate == PlayerState.IDLE){
				if (_currentItem['hd.originalfile']) {
					_currentItem.start = _currentItem['hd.originalstart'];
				}
			}
		}
		
		private function resetItem():void{
			if (_currentItem['hd.originalfile']) {
				_currentItem.file = _currentItem['hd.originalfile'];
				_currentItem.start = _currentItem['hd.originalstart'];
				_currentItem.streamer = _currentItem['hd.originalstreamer'];
			}	
		}
		
		
		/** Switch the currently playing file with a new one. **/
		private function swap(newFile:String, newStreamer:String = null):void {
			_swapped = true;
			var newList:Array = playlistToArray(_player.playlist);
			var newItem:PlaylistItem = newList[_player.playlist.currentIndex] as PlaylistItem;
			if (!newItem.hasOwnProperty('hd.originalfile')) {
				newItem['hd.originalfile'] = newItem.file;	
				newItem['hd.originalstart'] = newItem.start;	
				newItem['hd.originalstreamer'] = newItem.streamer;
			}
			newItem.file = newFile;
			newItem.start = _position;
			newItem.streamer = newStreamer;
			
			// Load a new playlist instead of changing the item's file property.
			// This is necessary due to a bug in 5.0 that doesn't load a new file if the PlaylistItem object doesn't change.
			if (_player.state == PlayerState.PLAYING || _player.state == PlayerState.BUFFERING) {
				_player.load(newList);
				_player.play();
			} else {
				_player.load(newList);
			}
		}
		
		/** Which file to play, based on the current state **/
		private function stateFile():String {
			if (config.state && !_currentItem.hasOwnProperty('ova.hidden')) {
				if (_currentItem.hasOwnProperty('hd.file')) {
					return _currentItem['hd.file'];
				} else if (config.hasOwnProperty('file')) {
					return config['file'];
				} else {
					return '';
				}
			} else {
				if (_currentItem.hasOwnProperty('hd.originalfile')) {
					return _currentItem['hd.originalfile'];
				} else if (_currentItem.hasOwnProperty('hd.file') || config.hasOwnProperty('file')) {
					return _currentItem.file;
				} else {
					return '';
				}
			}
		}
		
		/** Which streamer to use, based on the current streamer **/
		private function stateStreamer():String {
			if (config.state && !_currentItem.hasOwnProperty('ova.hidden')) {
				if (_currentItem.hasOwnProperty('hd.streamer')) {
					return _currentItem['hd.streamer'];
				} else if (config.hasOwnProperty('streamer')) {
					return config['streamer'];
				} else if (_currentItem.hasOwnProperty('streamer') != '') {
					return _currentItem.streamer;
				} else {
					return '';
				}
			} else {
				if (_currentItem.hasOwnProperty('hd.originalstreamer')) {
					return _currentItem['hd.originalstreamer'];
				} else if (_currentItem.hasOwnProperty('hd.streamer') || config.hasOwnProperty('streamer')) {
					return _currentItem.streamer;
				} else {
					return '';
				}
			}
		}
		
		/** Clone a playlist's items and put everything in an array **/
		private function playlistToArray(source:IPlaylist):Array {
			var playlistContents:Array = [];
			for (var i:Number = 0; i < source.length; i++) {
				playlistContents.push(clonePlaylistItem(source.getItemAt(i)));
			}
			return playlistContents;
		}
		
		/** Create a copy of a PlaylistItem **/
		private function clonePlaylistItem(source:PlaylistItem):PlaylistItem {
			var newItem:PlaylistItem = new PlaylistItem(source);
			newItem.author = source.author;
			newItem.date = source.date;
			newItem.description = source.description;
			newItem.duration = source.duration;
			newItem.file = source.file;
			newItem.image = source.image;
			newItem.link = source.link;
			newItem.mediaid = source.mediaid;
			newItem.provider = source.provider;
			newItem.start = source.start;
			newItem.streamer = source.streamer;
			newItem.tags = source.tags;
			newItem.title = source.title;
			newItem.type = source.type;
			return newItem;
		}
	}
}
