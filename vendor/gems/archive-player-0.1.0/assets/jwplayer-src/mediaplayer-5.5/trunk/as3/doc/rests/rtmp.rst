.. _rtmp:

RTMP Streaming
==============

RTMP (Real Time Messaging Protocol) is a system for delivering on-demand and live media to Adobe Flash applications (like the JW Player). RTMP supports video in both FLV and H.264 (MP4/MOV/F4V) :ref:`format <media>` and audio in both MP3 and AAC (M4A) format. RTMP offers several advantages over regular HTTP video downloads:

* RTMP can do live streaming - people can watch your video while it is being recorded.
* With RTMP, viewers can seek to not-yet-downloaded parts of a video. This is especially useful for longer-form content (> 10 minutes).
* Videos delivered over RTMP (and its secure brother, RTMPE) are harder to steal than videos delivered over regular HTTP.

However, do note that RTMP has its disadvantages too. Especially since the introduction of :ref:`http` (which also offer seeking to not-yet-downloaded parts), RTMP is not the only option for professional video delivery. Some drawbacks to be aware of:

* RTMP is a different protocol than HTTP and is sent over a different port (1935 instead of 80). Therefore, RTMP is frequently blocked by (corporate) firewalls. This can be circumvented by using RTMPT (tunneled), but this comes at a performance cost (longer buffer times - 2x in our experience).
* RTMP is a *true* streaming protocol, which means that the bandwidth of the connection must always be larger than the datarate of the video. If the connection drops for just a few seconds, the stream will stutter. If the connection overall is just a little less than the video datarate, the video will not play at all. With :ref:`http` on the other hand, people can simply wait until more of the video is downloaded.

The JW Player supports a wide array of features of the RTMP protocol.


Servers
-------

In order to use RTMP, your webhoster or CDN needs to have a dedicated RTMP webserver installed. There are three offerings, each one of them supported by the JW Player:

* The `Flash Media Server <http://www.adobe.com/products/flashmediaserver/>`_ from Adobe is the de facto standard. Since Flash is also developed by Adobe, new video functionalities always find their way in FMS first.
* The `Wowza Media Server <http://www.wowzamedia.com>`_ from Wowza is a great alternative, because it includes support for other streaming protocols than RTMP (for e.g. Shoutcast, the iPhone or Silverlight).
* The `Red5 Media Server <http://red5.org/>`_ is an open-source RTMP alternative. It lags in features (e.g. no dynamic streaming), but has an active and open community of developers.

RTMP servers are not solely used for one-to-many media streaming. They include support for such functionalities as video conferencing, document sharing and multiplayer games. Each of these functionalities is separately set up on the server in what is called an *application*. Every application has its own URL (typically a subfolder of the root). For example, these might be the path to both an on-demand streaming and live streaming application on your webserver:

.. code-block:: html

   rtmp://www.myserver.com/ondemand/
   rtmp://www.myserver.com/live/


Options
-------

To play an RTMP stream in the player, both the *streamer* and *file* :ref:`options <options>` must be set. The *streamer* is set to the server + path of your RTMP application. The *file* is set to the internal URL of video or audio file you want to stream. Here is an example :ref:`embed code <embed>`:

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     swfobject.embedSWF('player.swf','container','480','270','9.0.115','false',{
       file:'library/clip.mp4',
       streamer:'rtmp://www.myserver.com/ondemand/'
     });
   </script>


Note that the documentation of RTMP servers tell you to set the *file* option in players like this:

* For FLV video: **file=clip** (without the *.flv* extension).
* For MP4 video: **file=mp4:clip.mp4** (with *mp4:* prefix).
* For MP3 audio: **file=mp3:song.mp3** (with *mp3:* prefix).
* For AAC audio: **file=mp4:song.aac** (with *mp4:* prefix).

You do not have to do this with the JW Player, since the player takes care of stripping the extension or adding the prefix. If you do add the prefix yourself, the player will recognize it and not modify the URL.

Additionally, the player will leave querystring variables (e.g. for certain CDN security mechanisms) untouched. It basically ignores everything after the **?** character.

.. note:: 

   Because of the way options are loaded into Flash, it is not possible to use querystring delimiters (*?*, *=*, *&*) inside a single option. This issue can be circumvented by URL encoding these three characters. More info can be found in :ref:`options`.


Playlists
---------

RTMP streams can also be included in playlists, by leveraging the :ref:`JWPlayer namespace <playlists>`. The *streamer*  option should be set for every RTMP entry in a playlist. You don't have to set them in the embed code (just point the *file* option to your playlist).

Here's an example, an RSS feed with an RTMP video and audio clip:

.. code-block:: xml

   <rss version="2.0" xmlns:jwplayer="http://developer.longtailvideo.com/">
     <channel>
       <title>Playlist with RTMP streams</title>
   
       <item>
         <title>Big Buck Bunny</title>
         <description>Big Buck Bunny is a short animated film by the Blender Institute, 
            part of the Blender Foundation.</description>
         <enclosure url="files/bbb.mp4" type="video/mp4" length="3192846" />
         <jwplayer:streamer>rtmp://myserver.com/ondemand</jwplayer:streamer>
       </item>
   
       <item>
         <title>Big Buck Bunny (podcast)</title>
         <description>Big Buck Bunny is a short animated film by the Blender Institute, 
            part of the Blender Foundation.</description>
         <enclosure url="files/bbb.mp3" type="audio/mp3" length="3192846" />
         <jwplayer:streamer>rtmp://myserver.com/ondemand</jwplayer:streamer>
       </item>
   
     </channel>
   </rss>

Instead of the *enclosure* element, you can also use the *media:content* or *jwplayer:file* element. You could even set the *enclosure* to a regular http download of the video ánd *jwplayer:file* to the RTMP stream. That way, this single feed is useful for both regular RSS readers and the JW Player. More info in :ref:`playlists`.

.. note::

   Do not forget the **xmlns** at the top of the feed. It is needed by the player (and any other feed reader you might use) to understand the *jwplayer:* elements.


Live Streaming
--------------

A unique feature of RTMP is the ability to do live streaming, e.g. of presentations, concerts or sports events. Next to the player and an RTMP server, one then also needs a small tool to *ingest* (upload) the live video into the server. There's a bunch of such tools available, but the easiest to use is the (free) `Flash Live Media Encoder <http://www.adobe.com/products/flashmediaserver/flashmediaencoder/>`_. It is available for Windows and Mac.

A live stream can be embedded in the player using the same options as an on-demand stream. The only difference is that a live stream has no file extension. Example:

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     swfobject.embedSWF('player.swf','container','480','270','9.0.115','',{
       file:'livepresentation',
       streamer:'rtmp://www.myserver.com/live/'
     });
   </script>


Subscribing
^^^^^^^^^^^

When streaming live streams using the Akamai or Limelight CDN, players cannot simply connect to the live stream. Instead, they have to *subscribe* to it, by sending an **FCSubscribe call** to the server. The JW Player includes support for this functionality. Simply add the *rtmp.subscribe=true* option to your embed code to enable:

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     swfobject.embedSWF('player.swf','container','480','270','9.0.115','false',{
       file:'livepresentation',
       streamer:'rtmp://www.myserver.com/live/',
       'rtmp.subscribe':'true'
     });
   </script>


.. DVR Live Streaming
   ^^^^^^^^^^^^^^^^^^

.. Flash Media Server 3.5, introduced DVR live streaming - the ability to pause and seek in a live stream. This functionality is supported by the JW Player. It can be enabled by setting the option **rtmp.dvr=true**.

.. By default, a DVR stream acts like a regular on-demand stream, the only difference being that the *duration* of the stream keeps increasing. This leads to a slightly awkward user experience, since the time scrubber in the controlbar keeps bouncing around in one position instead of moving to the right.

.. To solve this issue, also set the *duration* option to the total duration of your live event (or, to be safe, a few minutes longer). That way the time scrubber will function normally. The *live head* of the event is then indicated by the download progress bar in the player. If a user seeks beyond that point, he will automatically get pushed to that head. Here's an example of DVR Live Streaming with duration (3600 seconds is 1 hour):

.. .. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     swfobject.embedSWF('player.swf','container','480','270','9.0.115','',{
       file:'livepresentation',
       streamer:'rtmp://www.myserver.com/live/',
       'rtmp.dvr':'true',
       'duration':'3600'
     });
   </script>

.. .. note:: DVR Live Streaming only works in combination with Adobe's Live Media Encoder and an RTMP server that has DVR enabled.


Dynamic Streaming
-----------------

Like with :ref:`http`, RTMP Streaming includes the ability to dynamically optimize the video quality for each individual viewer. Adobe calls this mechanism *dynamic streaming*. This functionality is supported for FMS 3.5+ and Wowza 2.0+.

To use dynamic streaming, you need multiple copies of your MP4 or FLV video, each with a different quality (dimensions and bitrate). These multiple videos are loaded into the player using an mRSS playlist (see example below). The player recognizes the various *levels* of your video and automatically selects the highest quality one that:

* Fits the *bandwidth* of the server » client connection.
* Fits the *width* of the player's display (or, to be precise, is not more than 20% larger).

As a viewer continues to watch the video, the player re-examines its decision (and might switch) in response to certain events:

* On a **bandwidth** increase or decrease - the bandwidth is re-calculated at an interval of 2 seconds.
* On a **resize** of the player. For example, when a viewer goes fullscreen and has sufficient bandwidth, the player might serve an HD version of the video.

A dynamic streaming switch is unobtrusive. There'll be no re-buffering or audible/visible hickup. It does take a few seconds for a switch to occur in response to a bandwidth change / player resize, since the server has to wait for a *keyframe* to do a smooth switch and the player always has a few seconds of the old stream in its buffer. To keep stream switches fast, make sure your videos are encoded with a small (2 to 4 seconds) keyframe interval.

.. note:: 

   So far, we have not been able to combine dynamic streaming with live streaming. This functionality is highlighted in  documentation from Adobe and Wowza, but in our tests we found that the bandwidth the player receives never exceeds the bandwidth of the level that currently plays. In other words: the player will never switch to a higher quality stream than the one it starts with. This seems to be a bug in the Flash plugin, since both FMS and Wowza have this issue.


Example
^^^^^^^

Here is an example dynamic streaming playlist (only one item). It is similar to a regular RTMP Streaming playlist, with the exception of the multiple video elements per item. The mRSS extension is the only way to provide these multiple elements including *bitrate* and *width* attributes:

.. code-block:: xml

   <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:jwplayer="http://developer.longtailvideo.com/">
     <channel>
       <title>Playlist with RTMP Dynamic Streaming</title>
   
       <item>
         <title>Big Buck Bunny</title>
         <description>Big Buck Bunny is a short animated film by the Blender Institute, 
            part of the Blender Foundation.</description>
         <media:group>
           <media:content bitrate="1800" url="videos/Qvxp3Jnv-4.mp4"  width="1280" />
           <media:content bitrate="1100" url="videos/Qvxp3Jnv-3.mp4" width="720"/>
           <media:content bitrate="700" url="videos/Qvxp3Jnv-2.mp4" width="480" />
           <media:content bitrate="400" url="videos/Qvxp3Jnv-1.mp4" width="320" />
         </media:group>
         <jwplayer:streamer>rtmp://www.myserver.com/ondemand/</jwplayer:streamer>
       </item>
   
     </channel>
   </rss>

Some hints:

* The *bitrate* attributes must be in kbps, as defined by the `mRSS spec <http://video.search.yahoo.com/mrss>`_. The *width* attribute is in pixels.
* It is recommended to order the streams by quality, the best one at the beginning.
* The four levels displayed in this feed are actually what we recommend for bitrate switching of widescreen MP4 videos. For 4:3 videos or FLV videos, you might want to increase the bitrates or decrease the dimensions a little.
* Some publishers only modify the bitrate when encoding multiple levels. The player can work with this, but modifying both the bitrate + dimensions allows for more variation between the levels (and re-use of videos, e.g. the smallest one for streaming to mobile phones).
* The *media:group* element here is optional, but it organizes the video links a little.


Load Balancing
--------------

For high-volume publishers who maintain several RTMP servers, the player supports load-balancing by means of an intermediate XML file. This is used by e.g. the `Highwinds <http://www.highwinds.com/>`_ and `VDO-X <http://www.vdo-x.net>`_  CDNs. Load balancing works like this:

* The player first requests the XML file (typically from single a *master* server).
* The server returns the XML file, which includes the location of the RTMP server to use (typically the server that's least busy).
* The player parses the XML file, connects to the server and starts the stream.


Example
^^^^^^^

Here's an example of such an XML file. It is in the SMIL format:

.. code-block:: html

   <smil> 
     <head> 
       <meta base="rtmp://server1234.mycdn.com/ondemand/" /> 
     </head> 
     <body> 
       <video src="library/myVideo.mp4" /> 
     </body> 
   </smil>

Here's an example embed code for enabling this functionality in the player. Note the *type=rtmp* :ref:`option <options>` is needed in addition to *rtmp.loadbalance*, since otherwise the player thinks the XML file is a playlist.

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     swfobject.embedSWF('player.swf','container','480','270','9.0.115','false',{
       file:'http://www.mycdn.com/videos/myVideo.mp4.xml',
       type:'rtmp',
       'rtmp.loadbalance':'true'
     });
   </script>

Playlists
^^^^^^^^^

RTMP Load balancing in playlists works in a similar fashion: the *type=rtmp* and *rtmp.loadbalance=true* options can be set for every entry in the playlist that uses loadbalancing. Here's an example with one item:

.. code-block:: xml

   <rss version="2.0" xmlns:jwplayer="http://developer.longtailvideo.com/">
     <channel>
       <title>Playlist with RTMP loadbalancing</title>
   
       <item>
         <title>Big Buck Bunny (podcast)</title>
         <description>Big Buck Bunny is a short animated film by the Blender Institute, 
            part of the Blender Foundation.</description>
         <enclosure url="http://www.mycdn.com/videos/bbb.mp3.xml" type="text/xml" length="185" />
         <jwplayer:type>rtmp</jwplayer:type>
         <jwplayer:rtmp.loadbalance>true</jwplayer:rtmp.loadbalance>
       </item>
   
     </channel>
   </rss>

See the playlist section above for more information on format and element support.

.. note:: 

   A combination of load balancing + dynamic streaming is not possible yet. We are working on such a functionality, which will be included in a future version of the player.
