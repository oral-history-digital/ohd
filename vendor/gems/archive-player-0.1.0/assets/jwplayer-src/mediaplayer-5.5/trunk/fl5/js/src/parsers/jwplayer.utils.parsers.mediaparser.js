/**
 * Parse a MRSS group into a playlistitem (used in RSS and ATOM).
 *
 * author zach
 * version 5.5
 */
(function(jwplayer) {

	jwplayer.utils.parsers.mediaparser = function() {
	};
	
	/** Prefix for the JW Player namespace. **/
	jwplayer.utils.parsers.mediaparser.PREFIX = 'media';
	
	/**
	 * Parse a feeditem for Yahoo MediaRSS extensions.
	 * The 'content' and 'group' elements can nest other MediaRSS elements.
	 * @param	{XML}		obj		The entire MRSS XML object.
	 * @param	{Object}	itm		The playlistentry to amend the object to.
	 * @return	{Object}			The playlistentry, amended with the MRSS info.
	 * @see ATOMParser
	 * @see RSSParser
	 **/
	jwplayer.utils.parsers.mediaparser.parseGroup = function(obj, itm) {
		var ytp = false;
		
		for (var i in obj.childNodes) {
			if (obj.childNodes[i].prefix == jwplayer.utils.parsers.mediaparser.PREFIX) {
				if (!obj.childNodes[i].localName){
					continue;
				}
				switch (obj.childNodes[i].localName.toLowerCase()) {
					case 'content':
						if (!ytp) {
							itm['file'] = jwplayer.utils.strings.xmlAttribute(obj.childNodes[i], 'url');
						}
						if (obj.childNodes[i].attributes.duration) {
							itm['duration'] = jwplayer.utils.strings.seconds(jwplayer.utils.strings.xmlAttribute(obj.childNodes[i], 'duration'));
						}
						if (obj.childNodes[i].attributes.start) {
							itm['start'] = jwplayer.utils.strings.seconds(jwplayer.utils.strings.xmlAttribute(obj.childNodes[i], 'start'));
						}
						if (obj.childNodes[i].childNodes && obj.childNodes[i].childNodes.length > 0) {
							itm = jwplayer.utils.parsers.mediaparser.parseGroup(obj.childNodes[i], itm);
						}
						if (obj.childNodes[i].attributes.width || obj.childNodes[i].attributes.bitrate) {
							if (!itm.levels) {
								itm.levels = [];
							}
							itm.levels.push({
								width: jwplayer.utils.strings.xmlAttribute(obj.childNodes[i], 'width'),
								bitrate: jwplayer.utils.strings.xmlAttribute(obj.childNodes[i], 'bitrate'),
								file: jwplayer.utils.strings.xmlAttribute(obj.childNodes[i], 'url')
							});
						}
						break;
					case 'title':
						itm['title'] = obj.childNodes[i].textContent;
						break;
					case 'description':
						itm['description'] = obj.childNodes[i].textContent;
						break;
					case 'keywords':
						itm['tags'] = obj.childNodes[i].textContent;
						break;
					case 'thumbnail':
						itm['image'] = jwplayer.utils.strings.xmlAttribute(obj.childNodes[i], 'url');
						break;
					case 'credit':
						itm['author'] = obj.childNodes[i].textContent;
						break;
					case 'player':
						if (obj.childNodes[i].url.indexOf('youtube.com') > 0) {
							ytp = true;
							itm['file'] = jwplayer.utils.strings.xmlAttribute(obj.childNodes[i], 'url');
						}
						break;
					case 'group':
						itm = jwplayer.utils.parsers.mediaparser.parseGroup(obj.childNodes[i], itm);
						break;
				}
			}
		}
		return itm;
	}
	
})(jwplayer);
