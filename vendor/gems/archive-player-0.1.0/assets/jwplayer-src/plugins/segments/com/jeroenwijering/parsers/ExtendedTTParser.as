/**
* Parse a (kind of) TimedText XML and return an array of captions.
**/

package com.jeroenwijering.parsers {


import com.jeroenwijering.utils.Strings;


public class ExtendedTTParser {


	parse static function parseCaptions(dat:XML):Object {
		var segments:Array = new Array({begin:0,segment:null})
		for each(var i:XML in dat.children()) {
			if(i.localName() == "segments") {
				for each(var j:XML in i.children()) {
					
				}
			}
		}
	}
	/** 
	* Parse the captions XML.
	*
	* @param dat	The loaded XML, which must be in W3C TimedText format.
	* @return		An array with captions. 
	* 				Each caption is an object with 'begin' and 'text' parameters.
	**/
	public static function parseCaptions(dat:XML):Object {
		var arr:Array = new Array({begin:0,text:''});
		var pushed:Boolean = false;
		var currentPosition:Number = 0;		
		var allLanguages:Array = new Array();
		for each (var i:XML in dat.children()) {
			if(i.localName() == "body") {
				for each (var j:XML in i.children()) {
					for each (var k:XML in j.children()) {
						if(k.localName() == 'p') {
							var obj:Object = ExtendedTTParser.parseCaption(k, allLanguages);
							arr.push(obj);
							if(obj['end']) {
								arr.push({begin:obj['end'],text:''});
								delete obj['end'];
								pushed = true;
							} else if (obj['dur']) {
								arr.push({begin:obj['begin']+obj['dur'],text:''});
								delete obj['dur'];
								pushed = true;
							}
							obj['prevPosition'] = currentPosition;
							currentPosition = obj['begin'];
							obj['nextPosition'] = null;
							
							if(pushed && arr.length > 3) {
								arr[arr.length - 4].nextPosition = currentPosition;
							} else if(!pushed && arr.length > 1) {
								arr[arr.length - 2].nextPosition = currentPosition;
							}
							
							allLanguages = obj['all_languages'];
							if(obj['all_languages']) {
								delete obj['all_languages'];
							}
						}
					}
				}
			}
		}
		
		return {
			captions:arr,
			languages:allLanguages
		};
	};


	/** Parse a single captions entry. **/
	private static function parseCaption(dat:XML, allLanguages:Array):Object {
		var ptn:RegExp = /(\n<br.*>\n)+/;
		var obj:Object = {
			begin:Strings.seconds(dat.@begin),
			dur:Strings.seconds(dat.@dur),
			end:Strings.seconds(dat.@end),
			prevPos:Strings.seconds(dat.@prevpos),
			nextPos:Strings.seconds(dat.@nextpos),
			heading:dat.@heading.toString(),
			text:dat.children().toString().replace(ptn,'\n').replace(ptn,'\n')
		};
		
		var lang:Object = {}
		for each (var e:XML in dat.children()) {
			if(e.localName() == 'span') {
				var span:Object = ExtendedTTParser.parseLanguage(e);
				if(span['lang']) {
					lang[span['lang']] = span['text'];
					var founded:Boolean = false;
					for (var i:uint = 0; i < allLanguages.length; i++) {
						if (allLanguages[i] == span['lang']) {
							founded = true;
							break;
						}
					}
					if (!(founded)) {
						allLanguages.push(span['lang']);
					}					
				}
			}
		}
		obj['lang'] = lang;
		obj['all_languages'] = allLanguages;
		return obj;
	};
	
	private static function parseLanguage(dat:XML):Object {
		var ptn:RegExp = /(\n<br.*>\n)+/;
		var obj:Object = {
			lang:dat.@lang.toString(),
			text:dat.children().toString().replace(ptn,'\n').replace(ptn,'\n')
		};
		return obj;
	}


}


}