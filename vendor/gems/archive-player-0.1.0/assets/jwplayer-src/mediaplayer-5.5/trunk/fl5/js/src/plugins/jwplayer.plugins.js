/**
 * Plugin class
 * @author zach
 * @version 5.5a
 */
(function(jwplayer) {

	/**
	 * Plugins attempted to load
	 */
	var _loadedplugins = {};
	
	/**
	 * Plugins that failed to load
	 */
	
	var _failedplugins = {};
	
	/**
	 * Plugins that have successfully loaded
	 */
	var _registeredplugins = {};
	
	/**
	 * Players that are waiting for plugins to load
	 */
	var _players = {};
	
	/**
	 * The current plugins repository
	 */
	var _pluginRepository = "http://plugins.longtailvideo.com/";
	
	jwplayer.plugins = function() {
	}
	
	/**
	 * Loads plugins
	 *
	 * @param {Object} embedder
	 */
	jwplayer.plugins.loadPlugins = function(embedder) {
		_players[embedder.api.id] = {
			api: embedder.api,
			embedder: embedder,
			loader: new jwplayer.plugins.loader(embedder.config.plugins, _loadedplugins, _failedplugins, _registeredplugins, _pluginRepository, function() {
				_checkComplete(embedder.api.id)
			})
		};
		return _players[embedder.api.id].loader;
	}
	
	/**
	 * Checks to see if a player has completed it's setup
	 *
	 * @param {String} id
	 */
	function _checkComplete(id) {
		if (_players[id] && _players[id].loader.isComplete()) {
			_players[id].embedder.embedPlayer();
		}
	}
	
	/**
	 * Mark a plugin load as having failed
	 * 
	 * @param {Object} id
	 */
	jwplayer.plugins.pluginFailed = function(id){
		_failedplugins[id] = true;
		for (var player in _players){
			if (typeof player == "string") {
				_checkComplete(player);
			}
		}
	};
	
	/**
	 * Registers a plugin once the load is complete.
	 *
	 * @param {Object} id
	 * @param {Object} template
	 */
	jwplayer.plugins.registerPlugin = function(id, arg1, arg2) {
		if (!_registeredplugins[id]) {
			_registeredplugins[id] = {
				flash: {},
				js: {}
			};
			if (arg1 && arg2) {
				_registeredplugins[id].flash.src = arg2;
				_registeredplugins[id].js.template = arg1;
			} else if (typeof arg1 == "string") {
				_registeredplugins[id].flash.src = arg1;
			} else if (typeof arg1 == "function") {
				_registeredplugins[id].js.template = arg1;
			} else if (!arg1 && !arg2) {
				_registeredplugins[id].flash.src = id;
			}
		}
		for (var player in _players){
			if (typeof player == "string") {
				_checkComplete(player);
			}
		}
	};
})(jwplayer);
