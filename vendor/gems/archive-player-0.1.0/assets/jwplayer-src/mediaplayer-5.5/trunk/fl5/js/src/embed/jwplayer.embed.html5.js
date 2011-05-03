/**
 * HTML5 mode embedder for the JW Player
 * @author Zach
 * @version 5.5
 */
(function(jwplayer) {

	jwplayer.embed.html5 = function(_container, _player, _options, _loader, _api) {
		function _resizePlugin (plugin, div, onready) {
			return function(evt) {
				var displayarea = document.getElementById(container.id + "_displayarea");
				if (onready) {
					displayarea.appendChild(div);
				}
				var display = displayarea.style;
				plugin.resize(display.width, display.height);
				div.left = display.left;
				div.top = display.top;
			}
		}
		
		this.embed = function() {
			if (jwplayer.html5) {
				_loader.setupPlugins(_api, _options, _resizePlugin);
				_container.innerHTML = "";
				var playerOptions = jwplayer.utils.extend({
					screencolor: '0x000000'
				}, _options);
				if (playerOptions.plugins) {
					delete playerOptions.plugins;
				}
				// TODO: remove this requirement from the html5 _player (sources instead of levels)
				if (playerOptions.levels && !playerOptions.sources) {
					playerOptions.sources = _options.levels;
				}
				if (playerOptions.skin && playerOptions.skin.toLowerCase().indexOf(".zip") > 0) {
					playerOptions.skin = playerOptions.skin.replace(/\.zip/i, ".xml");
				}
				var html5player = new (jwplayer.html5(_container)).setup(playerOptions);
				_api.container = document.getElementById(_api.id);
				_api.setPlayer(html5player, "html5");
			} else {
				return null;
			}
		}
		
		/**
		 * Detects whether the html5 player supports this configuration.
		 *
		 * @return {Boolean}
		 */
		this.supportsConfig = function() {
			var vid = document.createElement('video');
			if (!!vid.canPlayType) {
				if (_options) {
					var item = jwplayer.utils.getFirstPlaylistItemFromConfig(_options);
					if (typeof item.file == "undefined" && typeof item.levels == "undefined") {
						return true;
					} else if (item.file) {
						return html5CanPlay(vid, item.file, item.provider, item.playlistfile);
					} else if (item.levels && item.levels.length) {
						for (var i = 0; i < item.levels.length; i++) {
							if (item.levels[i].file && html5CanPlay(vid, item.levels[i].file, item.provider, item.playlistfile)) {
								return true;
							}
						}
					}
				} else {
					return true;
				}
			}
			
			return false;
		}
		
		/**
		 * Determines if a video element can play a particular file, based on its extension
		 * @param {Object} video
		 * @param {Object} file
		 * @param {Object} provider
		 * @param {Object} playlistfile
		 * @return {Boolean}
		 */
		html5CanPlay = function(video, file, provider, playlistfile) {
			// Don't support playlists
			if (playlistfile) {
				return false;
			}
			
			// YouTube is supported
			if (provider && provider == "youtube") {
				return true;
			}
			
			// If a provider is set, only proceed if video
			if (provider && provider != "video" && provider != "http") {
				return false;
			}
			
			var extension = jwplayer.utils.extension(file);
			
			// Check for Android, which returns false for canPlayType
			if (jwplayer.utils.isLegacyAndroid() && extension.match(/m4v|mp4/)) {
				return true;
			}
			
			// Last, but not least, ask the browser
			return browserCanPlay(video, extension);
		};
		
		/**
		 * 
		 * @param {Object} video
		 * @param {Object} extension
		 * @return {Boolean}
		 */
		browserCanPlay = function(video, extension) {
			// OK to use HTML5 with no extension
			if (!extension) {
				return true;
			} 

			return video.canPlayType(jwplayer.utils.getMIMEType(extension));
		}
	};
	
})(jwplayer);
