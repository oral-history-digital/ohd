/**
 * Embedder for the JW Player
 * @author Zach
 * @version 5.5
 */
(function(jwplayer) {

	jwplayer.embed = function(api) {
		this.api = api;
		var mediaConfig = jwplayer.utils.mediaparser.parseMedia(this.api.container);
		this.config = new jwplayer.embed.config(jwplayer.utils.extend({}, jwplayer.embed.defaults, mediaConfig, this.api.config), this);
		this.pluginloader = new jwplayer.plugins.loadPlugins(this);
		this.events = {};
		this.embedPlayer = function() {
			if (this.pluginloader.isComplete()) {
				for (var player = 0; player < this.players.length; player++) {
					if (this.players[player].type && jwplayer.embed[this.players[player].type]) {
						var configClone = this.config;
						if (this.players[player].config) {
							configClone = jwplayer.utils.extend(jwplayer.utils.clone(this.config), this.players[player].config);
						}
						var embedder = new jwplayer.embed[this.players[player].type](document.getElementById(this.api.id), this.players[player], configClone, this.pluginloader, this.api);
						if (embedder.supportsConfig()) {
							embedder.embed();
							return;
						}
					}
				}
				jwplayer.utils.log("No suitable players found");
				new jwplayer.embed.logo(jwplayer.utils.extend({
					hide: true
				}, this.config.components.logo), "none", this.api.id);
			}
			this.setupEvents();
			
			return this.api;
		};
		
		this.setupEvents = function() {
			for (var evt in this.events) {
				if (typeof this.api[evt] == "function") {
					(this.api[evt]).call(this.api, this.events[evt]);
				}
			}
		};
		return this;
	};
	
	function noviceEmbed() {
		if (!document.body) {
			return setTimeout(noviceEmbed, 15);
		}
		var videoTags = jwplayer.utils.selectors.getElementsByTagAndClass('video', 'jwplayer');
		for (var i = 0; i < videoTags.length; i++) {
			var video = videoTags[i];
			jwplayer(video.id).setup({
				players: [{
					type: 'flash',
					src: '/jwplayer/player.swf'
				}, {
					type: 'html5'
				}]
			});
		}
	}
	
	noviceEmbed();
	
	
})(jwplayer);
