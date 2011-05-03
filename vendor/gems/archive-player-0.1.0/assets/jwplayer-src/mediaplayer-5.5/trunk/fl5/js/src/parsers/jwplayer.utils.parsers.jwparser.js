/**
 * Parse a feed item for JWPlayer content.
 *
 * @author zach
 * @version 5.5
 */
(function(jwplayer) {

	jwplayer.utils.parsers.jwparser = function() {
	};
	
	jwplayer.utils.parsers.jwparser.PREFIX = 'jwplayer';
	
	/**
	 * Parse a feed entry for JWPlayer content.
	 *
	 * @param	{XML}		obj	The XML object to parse.
	 * @param	{Object}	itm	The playlistentry to amend the object to.
	 * @return	{Object}		The playlistentry, amended with the JWPlayer info.
	 * @see			ASXParser
	 * @see			ATOMParser
	 * @see			RSSParser
	 * @see			SMILParser
	 * @see			XSPFParser
	 */
	jwplayer.utils.parsers.jwparser.parseEntry = function(obj, itm) {
		for (var i in obj.childNodes) {
			if (obj.childNodes[i].prefix == jwplayer.utils.parsers.jwparser.PREFIX) {
				itm[obj.childNodes[i].localName] = jwplayer.utils.strings.serialize(obj.childNodes[i].textContent);
			}
			if (!itm['file'] && String(itm['link']).toLowerCase().indexOf('youtube') > -1) {
				itm['file'] = itm['link'];
			}
		}
		return itm;
	}
	
	/**
	 * Determine the provider of an item
	 * @param {Object} item
	 * @return {String} provider
	 */
	jwplayer.utils.parsers.jwparser.getProvider = function(item) {
		if (item['type']) {
			return item['type'];
		} else if (item['file'].indexOf('youtube.com/w') > -1 || item['file'].indexOf('youtube.com/v') > -1) {
			return "youtube";
		} else if (item['streamer'] && item['streamer'].indexOf('rtmp') == 0) {
			return "rtmp";
		} else if (item['streamer'] && item['streamer'].indexOf('http') == 0) {
			return "http";
		} else {
			var ext = jwplayer.utils.strings.extension(item['file']);
			if (extensions.hasOwnProperty(ext)) {
				return extensions[ext];
			}
		}
		return "";
	}
	
})(jwplayer);
