/**
 * JW Player controller component
 *
 * @author zach
 * @version 5.4
 */
(function(jwplayer) {

	var _mediainfovariables = ["width", "height", "state", "playlist", "item", "position", "buffer", "duration", "volume", "mute", "fullscreen"];
	
	jwplayer.html5.controller = function(api, container, model, view) {
		var _api = api;
		var _model = model;
		var _view = view;
		var _container = container;
		var _itemUpdated = true;
		var _oldstart = -1;
		
		var debug = (_model.config.debug !== undefined) && (_model.config.debug.toString().toLowerCase() == 'console');
		var _eventDispatcher = new jwplayer.html5.eventdispatcher(_container.id, debug);
		jwplayer.utils.extend(this, _eventDispatcher);
		
		function forward(evt) {
			_eventDispatcher.sendEvent(evt.type, evt);
		}
		
		_model.addGlobalListener(forward);
		
		function _play() {
			try {
				if (_model.playlist[_model.item].levels[0].file.length > 0) {
					if (_itemUpdated || _model.state == jwplayer.api.events.state.IDLE) {
						_model.addEventListener(jwplayer.api.events.JWPLAYER_MEDIA_BUFFER_FULL, function() {
							_model.getMedia().play();
						});
						_model.addEventListener(jwplayer.api.events.JWPLAYER_MEDIA_TIME, function(evt) {
							if (evt.position >= _model.playlist[_model.item].start && _oldstart >= 0) {
								_model.playlist[_model.item].start = _oldstart;
								_oldstart = -1;
							}
						});
						if (_model.config.repeat) {
							_model.addEventListener(jwplayer.api.events.JWPLAYER_MEDIA_COMPLETE, function(evt) {
								setTimeout(_completeHandler, 25);
							});
						}
						_model.getMedia().load(_model.playlist[_model.item]);
						_itemUpdated = false;
					} else if (_model.state == jwplayer.api.events.state.PAUSED) {
						_model.getMedia().play();
					}
				}
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		
		/** Switch the pause state of the player. **/
		function _pause() {
			try {
				if (_model.playlist[_model.item].levels[0].file.length > 0) {
					switch (_model.state) {
						case jwplayer.api.events.state.PLAYING:
						case jwplayer.api.events.state.BUFFERING:
							_model.getMedia().pause();
							break;
					}
				}
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		
		/** Seek to a position in the video. **/
		function _seek(position) {
			try {
				if (_model.playlist[_model.item].levels[0].file.length > 0) {
					if (typeof position != "number") {
						position = parseFloat(position);
					}
					switch (_model.state) {
						case jwplayer.api.events.state.IDLE:
							if (_oldstart < 0) {
								_oldstart = _model.playlist[_model.item].start;
								_model.playlist[_model.item].start = position;
							}
							_play();
							break;
						case jwplayer.api.events.state.PLAYING:
						case jwplayer.api.events.state.PAUSED:
						case jwplayer.api.events.state.BUFFERING:
							_model.getMedia().seek(position);
							break;
					}
				}
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		
		/** Stop playback and loading of the video. **/
		function _stop() {
			try {
				if (_model.playlist[_model.item].levels[0].file.length > 0 && _model.state != jwplayer.api.events.state.IDLE) {
					_model.getMedia().stop();
				}
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		/** Stop playback and loading of the video. **/
		function _next() {
			try {
				if (_model.playlist[_model.item].levels[0].file.length > 0) {
					if (_model.config.shuffle) {
						_item(_getShuffleItem());
					} else if (_model.item + 1 == _model.playlist.length) {
						_item(0);
					} else {
						_item(_model.item + 1);
					}
				}
				if (_model.state != jwplayer.api.events.state.PLAYING && _model.state != jwplayer.api.events.state.BUFFERING) {
					_play();
				}
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		/** Stop playback and loading of the video. **/
		function _prev() {
			try {
				if (_model.playlist[_model.item].levels[0].file.length > 0) {
					if (_model.config.shuffle) {
						_item(_getShuffleItem());
					} else if (_model.item === 0) {
						_item(_model.playlist.length - 1);
					} else {
						_item(_model.item - 1);
					}
				}
				if (_model.state != jwplayer.api.events.state.PLAYING && _model.state != jwplayer.api.events.state.BUFFERING) {
					_play();
				}
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		function _getShuffleItem() {
			var result = null;
			if (_model.playlist.length > 1) {
				while (result === null) {
					result = Math.floor(Math.random() * _model.playlist.length);
					if (result == _model.item) {
						result = null;
					}
				}
			} else {
				result = 0;
			}
			return result;
		}
		
		/** Stop playback and loading of the video. **/
		function _item(item) {
			_model.resetEventListeners();
			_model.addGlobalListener(forward);
			try {
				if (_model.playlist[item].levels[0].file.length > 0) {
					var oldstate = _model.state;
					if (oldstate !== jwplayer.api.events.state.IDLE) {
						_stop();
					}
					_model.item = item;
					_itemUpdated = true;
					_model.setActiveMediaProvider(_model.playlist[_model.item]);
					_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_PLAYLIST_ITEM, {
						"index": item
					});
					if (oldstate == jwplayer.api.events.state.PLAYING || oldstate == jwplayer.api.events.state.BUFFERING || _model.config.chromeless) {
						_play();
					}
				}
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		/** Get / set the video's volume level. **/
		function _setVolume(volume) {
			try {
				switch (typeof(volume)) {
					case "number":
						_model.getMedia().volume(volume);
						break;
					case "string":
						_model.getMedia().volume(parseInt(volume, 10));
						break;
				}
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		
		/** Get / set the mute state of the player. **/
		function _setMute(state) {
			try {
				if (typeof state == "undefined") {
					_model.getMedia().mute(!_model.mute);
				} else {
					if (state.toString().toLowerCase() == "true") {
						_model.getMedia().mute(true);
					} else {
						_model.getMedia().mute(false);
					}
				}
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		
		/** Resizes the video **/
		function _resize(width, height) {
			try {
				_model.width = width;
				_model.height = height;
				_view.resize(width, height);
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_RESIZE, {
					"width": _model.width,
					"height": _model.height
				});
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		
		/** Jumping the player to/from fullscreen. **/
		function _setFullscreen(state) {
			try {
				if (typeof state == "undefined") {
					_model.fullscreen = !_model.fullscreen;
					_view.fullscreen(!_model.fullscreen);
				} else {
					if (state.toString().toLowerCase() == "true") {
						_model.fullscreen = true;
						_view.fullscreen(true);
					} else {
						_model.fullscreen = false;
						_view.fullscreen(false);
					}
				}
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_RESIZE, {
					"width": _model.width,
					"height": _model.height
				});
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_FULLSCREEN, {
					"fullscreen": state
				});
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		
		/** Loads a new video **/
		function _load(arg) {
			try {
				_stop();
				_model.loadPlaylist(arg);
				_item(_model.item);
				return true;
			} catch (err) {
				_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_ERROR, err);
			}
			return false;
		}
		
		jwplayer.html5.controller.repeatoptions = {
			LIST: "LIST",
			ALWAYS: "ALWAYS",
			SINGLE: "SINGLE",
			NONE: "NONE"
		};
		
		function _completeHandler() {
			_model.resetEventListeners();
			_model.addGlobalListener(forward);
			switch (_model.config.repeat.toUpperCase()) {
				case jwplayer.html5.controller.repeatoptions.SINGLE:
					_play();
					break;
				case jwplayer.html5.controller.repeatoptions.ALWAYS:
					if (_model.item == _model.playlist.length - 1 && !_model.config.shuffle) {
						_item(0);
						_play();
					} else {
						_next();
					}
					break;
				case jwplayer.html5.controller.repeatoptions.LIST:
					if (_model.item == _model.playlist.length - 1 && !_model.config.shuffle) {
						_item(0);
					} else {
						_next();
					}
					break;
			}
		}
		
		this.play = _play;
		this.pause = _pause;
		this.seek = _seek;
		this.stop = _stop;
		this.next = _next;
		this.prev = _prev;
		this.item = _item;
		this.setVolume = _setVolume;
		this.setMute = _setMute;
		this.resize = _resize;
		this.setFullscreen = _setFullscreen;
		this.load = _load;
	};
})(jwplayer);
