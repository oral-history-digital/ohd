/**
 * Configuration for the JW Player Embedder
 * @author Zach
 * @version 5.5
 */
(function(jwplayer) {

	jwplayer.embed.config = function(config, embedder) {
		var parsedConfig = jwplayer.utils.extend({}, config);
		for (var option in parsedConfig) {
			if (option.indexOf(".") > -1) {
				var path = option.split(".");
				var tempConfig = parsedConfig;
				for (var edge = 0; edge < path.length; edge++) {
					if (edge == path.length - 1) {
						tempConfig[path[edge]] = parsedConfig[option];
						delete parsedConfig[option];
					} else {
						if (tempConfig[path[edge]] === undefined) {
							tempConfig[path[edge]] = {};
						}
						tempConfig = tempConfig[path[edge]];
					}
				}
			}
		}
		
		if (typeof parsedConfig.plugins == "string") {
			var pluginArray = parsedConfig.plugins.split(",");
			for (var plugin = 0; plugin < pluginArray.length; plugin++) {
				var pluginName = jwplayer.utils.getPluginName(pluginArray[plugin]);
				if (typeof parsedConfig[pluginName] == "object") {
					if (typeof parsedConfig.plugins != "object") {
						parsedConfig.plugins = {};
					}
					parsedConfig.plugins[pluginArray[plugin]] = parsedConfig[pluginName];
					delete parsedConfig[pluginName];
				}
			}
		}
		
		if (typeof parsedConfig.playlist == "string") {
			if (!parsedConfig.components.playlist) {
				parsedConfig.components.playlist = {};
			}
			parsedConfig.components.playlist.position = parsedConfig.playlist;
			delete parsedConfig.playlist;
		}
		
		if (typeof parsedConfig.controlbar == "string") {
			if (!parsedConfig.components.controlbar) {
				parsedConfig.components.controlbar = {};
			}
			parsedConfig.components.controlbar.position = parsedConfig.controlbar;
			delete parsedConfig.controlbar;
		}
		
		if (parsedConfig.events) {
			embedder.events = parsedConfig.events;
			delete parsedConfig.events;
		}
		if (parsedConfig.players) {
			embedder.players = parsedConfig.players;
			delete parsedConfig.players;
		}
		
		return parsedConfig;
		
	};
	
})(jwplayer);
