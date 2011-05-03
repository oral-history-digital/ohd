package com.longtailvideo.jwplayer.utils
{
	import com.longtailvideo.jwplayer.model.IPlaylist;
	import com.longtailvideo.jwplayer.model.PlaylistItem;
	import com.longtailvideo.jwplayer.model.PlaylistItemLevel;

	public class JavascriptSerialization
	{

		public static function playlistToArray(list:IPlaylist):Array {
			var arry:Array = [];
			
			for (var i:Number=0; i < list.length; i++) {
				arry.push(playlistItemToObject(list.getItemAt(i)));
			}
			
			return arry;
		}
		
		public static function playlistItemToObject(item:PlaylistItem):Object {
			var obj:Object = {
				'author':		item.author,
					'date':			item.date,
					'description':	item.description,
					'duration':		item.duration,
					'file':			item.file,
					'image':		item.image,
					'link':			item.link,
					'mediaid':		item.mediaid,
					'provider':		item.provider,
					'start':		item.start,
					'streamer':		item.streamer,
					'tags':			item.tags,
					'title':		item.title,
					'type':			item.provider
			};
			
			for (var i:String in item) {
				obj[i] = item[i];
			}
			
			if (item.levels.length > 0) {
				obj['levels'] = [];
				for each (var level:PlaylistItemLevel in item.levels) {
					obj['levels'].push({url:level.file, bitrate:level.bitrate, width:level.width});
				}
			}
			
			return obj;
		}
		
		public static function stripDots(obj:Object):Object {
			// Todo: create nested objects instead of removing the dots
			
			var newObj:Object = (obj is Array) ? new Array() : new Object();
			for (var i:String in obj) {
				if (i.indexOf(".") < 0) {
					if (typeof(obj[i]) == "object") {
						newObj[i] = stripDots(obj[i]);
					} else {
						newObj[i] = obj[i];
					}
				}
			}
			return newObj;
		}
		
		
	}
}