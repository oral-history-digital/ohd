/**
* Parse a (kind of) TimedText XML and return an array of captions.
**/

package com.jeroenwijering.parsers {


import com.jeroenwijering.utils.Strings;


public class SegmentsParser {


	public static function parseSegments(dat:XML):Object {
		
		var segments:Array = new Array({
		  id:null,
			begin:0,
			segmentData:{}
		});
		
		for each(var i:XML in dat.children()) {
			if(i.localName() == "body") {
			  for each(var j:XML in i.children()) {
				  for each(var k:XML in j.children()) {
  					if(k.localName() == "segment") {
  						var segment:Object = SegmentsParser.readSegment(k);
						
  						segments.push(segment);
  						segments.push({
  						  id:null,
  						  begin:segment['end'],
  						  segmentData:{}
  					  });
  					  delete segment['end'];
  					}
  				}
				}
			}
		}
		
		return { segments:segments };
		  
	};
	
	private static function readSegment(dat:XML):Object {
		var segment:Object = {
		  id:dat.@id.toString(),
		  begin:Strings.seconds(dat.@begin),
		  end:Strings.seconds(dat.@end),
		
		  segmentData:{}
		};
		
	  var ptn:RegExp = /(\n<br.*>\n)+/;
	  var segmentData:Object = {};
		for each(var attribute:XML in dat.children()) {
		  var key:String = attribute.localName();
		  segmentData[key] = attribute.toString().replace(ptn,'\n');
		}
		segment['segmentData'] = segmentData;
		
		return segment;
	};
}
}