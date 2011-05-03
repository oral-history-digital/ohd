/**
 * JW Player playlist item model
 *
 * @author zach
 * @version 5.4
 */
(function(jwplayer) {
	jwplayer.html5.playlistitem = function(config) {
		var _playlistitem = {
			author: "",
			date: "",
			description: "",
			image: "",
			link: "",
			mediaid: "",
			tags: "",
			title: "",
			provider: "",
			
			file: "",
			streamer: "",
			duration: -1,
			start: 0,
			
			currentLevel: -1,
			levels: []
		};
		
		for (var property in _playlistitem) {
			if (config[property] !== undefined) {
				_playlistitem[property] = config[property];
			}
		}
		if (_playlistitem.levels.length === 0) {
			_playlistitem.levels[0] = new jwplayer.html5.playlistitemlevel(_playlistitem);
		}
		return _playlistitem;
	};
})(jwplayer);
