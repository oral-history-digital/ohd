/**
 * Plugin loader class
 * @author zach
 * @version 5.5a
 */
(function(jwplayer) {

	/**
	 * The Plugin loader class
	 * @param {Object} config
	 * @param {Object} loading
	 * @param {Function} callback
	 */
	jwplayer.plugins.loader = function(config, loading, failed, registered, pluginRepository, callback) {
		var _incomplete = [];
		var _loading = false;
		
		var _pluginOrder = [];
		
		/**
		 * Indicates that plugin loading is complete.
		 *
		 * @return {Boolean} True if all plugins have loaded, 404ed, or are swfs
		 */
		function _isComplete() {
			if (_incomplete.length == 0 && !_loading){
				return true;
			}
			for (var plugin = 0; plugin < _incomplete.length; plugin++) {
				if (registered[_incomplete[plugin]] || failed[_incomplete[plugin]]){
					_incomplete.splice(plugin, 1);	
				}	
			}
			return (_incomplete.length == 0 && !_loading);
		}
		
		this.isComplete = _isComplete;
		
		/**
		 * Returns the plugins that have been registered
		 */
		function _getPlugins() {
			var plugins = [];
			for (var plugin = 0; plugin < _pluginOrder.length; plugin++) {
				var pluginName = jwplayer.utils.getPluginName(_pluginOrder[plugin]);
				if (!failed[pluginName]) {
					var pluginObject = {
						id: _pluginOrder[plugin],
						js: {},
						flash: {}
					};
					if (registered[pluginName]) {
						if (registered[pluginName].js.template) {
							pluginObject.js.template = registered[pluginName].js.template;
						}
						if (registered[pluginName].flash.src) {
							pluginObject.flash.src = registered[pluginName].flash.src;
						}
					}
					plugins.push(pluginObject);
				}
			}

			return plugins;
		}
		
		/**
		 * Initializes the plugin Loader
		 */
		function _setup() {
			_loading = true;
			if (config) {
				if (typeof config == "string") {
					_pluginOrder = config.replace(/\s*/g, "").split(",");
				} else {
					for (var plugin in config) {
						if (plugin && typeof plugin == "string") {
							_pluginOrder.push(plugin);
						}
					}
				}
				for (var pluginIndex = 0; pluginIndex < _pluginOrder.length; pluginIndex++) {
					_loadPlugin(_pluginOrder[pluginIndex]);
				}
			}
			_loading = false;
			//_checkComplete();
		}
		
		/**
		 * Check to see if loading is complete.
		 */
		function _checkComplete() {
			if (_isComplete()) {
				callback();
			}
		}
		
		/**
		 * Loads a plugin from a CDN or file path
		 * @param {Object} plugin - String name of a plugin
		 */
		function _loadPlugin(plugin) {
			var pluginName = jwplayer.utils.getPluginName(plugin);
			if (registered[pluginName] || failed[pluginName]){
			// Plugin is already registered
				return;
			} else if (loading[pluginName]) {
			// Plugin is loading already
				_incomplete.push(pluginName);
				return;
			}
			// Plugin is not yet loading
			if (plugin.lastIndexOf(".swf") > -1) {
				jwplayer.plugins.registerPlugin(pluginName, plugin);
			} else if (_incomplete.toString().indexOf(pluginName) < 0) {
				var pluginPath = _resolvePlugin(plugin);
				loading[pluginName] = {
					src: pluginPath
				};
				failed[pluginName] = false;
				_incomplete.push(pluginName);
				var element = document.createElement("script");
				document.getElementsByTagName("head")[0].appendChild(element);
				element.type = "text/javascript";
				// These might not work in IE...
				element.onload = _pluginLoadSuccess(pluginName);
				element.onerror = _pluginLoadError(pluginName, plugin);
				element.src = pluginPath;
			}
		}
		
		/**
		 * Returns a function that will later mark a plugin load as successful
		 *
		 * @param {String} plugin
		 */
		function _pluginLoadSuccess(plugin) {
			return function(evt) {
				if (registered[plugin]){
					_incomplete.splice(_incomplete.indexOf(plugin), 1);	
				}
				//_checkComplete();
			}
		}
		
		/**
		 * Returns a function that will later mark a plugin load as successful
		 *
		 * @param {String} plugin
		 */
		function _pluginLoadError(pluginName, plugin) {
			return function(evt) {
				if (plugin.lastIndexOf("/") < 0 && plugin.lastIndexOf(".") < 0) {
					if (registered[plugin]) {
						_incomplete.splice(_incomplete.indexOf(plugin), 1);
					}	
					jwplayer.plugins.registerPlugin(plugin);
					return;
				}
				jwplayer.plugins.pluginFailed(pluginName);
			}
		}
		
		/**
		 * Returns the path to a plugin
		 *
		 * @param {String} plugin
		 */
		function _resolvePlugin(plugin) {
			if (plugin.lastIndexOf("/") > -1 || plugin.lastIndexOf(".") > -1) {
				return plugin;
			}
			var pluginName = jwplayer.utils.getPluginName(plugin);
			return pluginRepository + jwplayer.version.split(".")[0] + "/" + pluginName + "/" + pluginName + ".js";
		}
		
		_setup();
		
		this.setupPlugins = function(api, config, resizer){
			plugins = _getPlugins();
			var flashPlugins = {
				length: 0,
				plugins: {}
			};
			var jsplugins = {};
			for (var plugin = 0; plugin < plugins.length; plugin++) {
				var pluginName = jwplayer.utils.getPluginName(plugins[plugin].id);
				if (plugins[plugin].flash.src) {
					flashPlugins.plugins[plugins[plugin].flash.src] = config.plugins[plugins[plugin].id];
					flashPlugins.length++;
				}
				if (plugins[plugin].js.template) {
					var div = document.createElement("div");
					div.id = _container.id + "_" + pluginName;
					div.style.position = "absolute";
					div.style.zIndex = plugin + 10;
					var newplugin = new plugins[plugin].js.template(api, div, config.plugins[plugins[plugin].id]);
					jsplugins[pluginName] = newplugin;
					if (typeof newplugin.resize != "undefined") {
						api.onReady(resizer(newplugin, div, _container, true));
						api.onResize(resizer(newplugin, div, _container));
					}
				}
			}
			
			api.plugins = jsplugins;
			
			return flashPlugins;
		};
		
		return this;
	}
})(jwplayer);
