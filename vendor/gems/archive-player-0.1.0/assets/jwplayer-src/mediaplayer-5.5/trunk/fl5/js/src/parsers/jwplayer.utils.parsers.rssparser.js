/**
 * Parse an RSS feed and translate it to a playlist.
 *
 * @author zach
 * @version 5.5
 */
(function(jwplayer) {

	jwplayer.utils.parsers.rssparser = function() {
	};
	
	/**
	 * Parse an RSS playlist for feed items.
	 *
	 * @param {XML} dat
	 * @reuturn {Array} playlistarray
	 */
	jwplayer.utils.parsers.rssparser.parse = function(dat) {
		var arr = [];
		for (var i in dat.childNodes) {
			if (dat.childNodes[i].localName && dat.childNodes[i].localName.toLowerCase() == 'channel') {
				for (var j in dat.childNodes[i].childNodes) {
					if (dat.childNodes[i].childNodes[j].localName && dat.childNodes[i].childNodes[j].localName.toLowerCase() == 'item') {
						arr.push(_parseItem(dat.childNodes[i].childNodes[j]));
					}
				}
			}
		}
		return arr;
	};
	
	
	/** 
	 * Translate RSS item to playlist item.
	 *
	 * @param {XML} obj
	 * @return {PlaylistItem} PlaylistItem
	 */
	function _parseItem(obj) {
		var itm = {};
		for (var i in obj.childNodes) {
			if (!obj.childNodes[i].localName){
				continue;
			}
			switch (obj.childNodes[i].localName.toLowerCase()) {
				case 'enclosure':
					itm['file'] = jwplayer.utils.strings.xmlAttribute(obj.childNodes[i], 'url');
					break;
				case 'title':
					itm['title'] = obj.childNodes[i].textContent;
					break;
				case 'pubdate':
					itm['date'] = obj.childNodes[i].textContent;
					break;
				case 'description':
					itm['description'] = obj.childNodes[i].textContent;
					break;
				case 'link':
					itm['link'] = obj.childNodes[i].textContent;
					break;
				case 'category':
					if (itm['tags']) {
						itm['tags'] += obj.childNodes[i].textContent;
					} else {
						itm['tags'] = obj.childNodes[i].textContent;
					}
					break;
			}
		}
		itm = jwplayer.utils.parsers.itunesparser.parseEntry(obj, itm);
		itm = jwplayer.utils.parsers.mediaparser.parseGroup(obj, itm);
		itm = jwplayer.utils.parsers.jwparser.parseEntry(obj, itm);

		return new jwplayer.html5.playlistitem(itm);
	}
	
	
})(jwplayer);
