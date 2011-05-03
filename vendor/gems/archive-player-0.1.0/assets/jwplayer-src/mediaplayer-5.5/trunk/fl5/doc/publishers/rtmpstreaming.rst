.. _rtmpstreaming:

RTMP Streaming
==============

RTMP (Real Time Messaging Protocol) is a system for delivering on-demand and live media to Adobe Flash applications (like the JW Player). RTMP supports video in FLV and H.264 (MP4/MOV/F4V) :ref:`formats <mediaformats>` and audio in  MP3 and AAC (M4A) :ref:`formats  <mediaformats>`. RTMP offers several advantages over regular HTTP video downloads:

* RTMP can do live streaming - people can watch your video while it is being recorded.
* With RTMP, viewers can seek to not-yet-downloaded parts of a video. This is especially useful for longer-form content (> 10 minutes).
* Videos delivered over RTMP (and its encrypted brother, RTMPE) are harder to steal than videos delivered over regular HTTP.

However, do note that RTMP has its disadvantages too. Especially since the introduction of :ref:`httpstreaming` (used by e.g. Youtube), RTMP is not the only option for efficient video delivery. Some drawbacks to be aware of:

* RTMP is a different protocol than HTTP and is sent over a different port (1935 instead of 80). Therefore, RTMP is frequently blocked by (corporate) firewalls. The JW Player :ref:`detects and circumvents this issue <rtmpt>`.
* RTMP is a *true* streaming protocol, which means that the bandwidth of the connection must always be larger than the datarate of the video. If the connection drops for a couple of seconds, the stream will stutter. If the connection bandwidth overall is smaller than the video datarate, the video will not play at all.

The JW Player supports a wide array of features of the RTMP protocol, listed below.


Servers
-------

In order to use RTMP, your webhoster or CDN needs to have a dedicated RTMP webserver installed. There are three major offerings, all supported by the JW Player:

* The `Flash Media Server <http://www.adobe.com/products/flashmediaserver/>`_ from Adobe is the de facto standard. Since Flash is also developed by Adobe, new video functionalities always find their way in FMS first.
* The `Wowza Media Server <http://www.wowzamedia.com>`_ from Wowza is a great alternative, because it includes support for other streaming protocols than RTMP (for e.g. Shoutcast, the iPad/iPhone or Silverlight).
* The `Red5 Media Server <http://red5.org/>`_ is an open-source RTMP alternative. It lags in features (e.g. no dynamic streaming), but is completely free.

RTMP servers are not solely used for one-to-many media streaming. They include support for such functionalities as video conferencing, document sharing and multiplayer games. Each of these functionalities is separately set up on the server in what is called an *application*. Every application has its own URL (typically a subfolder of the root). For example, these might be the path to both an on-demand streaming and live streaming application on your webserver:

.. code-block:: html

   rtmp://www.myserver.com/ondemand/
   rtmp://www.myserver.com/live/

The JW Player solely supports the basic live, on-demand and dvr streaming applications. There's no support for such things as webcasting, videochat or screen sharing.


Options
-------

To play an RTMP stream in the player, both the *streamer* and *file* :ref:`options <options>` must be set. The *streamer* is set to the server + path of your RTMP application. The *file* is set to the internal URL of video or audio file you want to stream. Here is an example :ref:`embed code <embedding>`:

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     var flashvars = { 
       file:'library/clip.mp4',
       streamer:'rtmp://www.myserver.com/ondemand/'
     };

     swfobject.embedSWF('player.swf','container','480','270','9.0.115','false', flashvars, 
      {allowfullscreen:'true',allowscriptaccess:'always'},
      {id:'jwplayer',name:'jwplayer'}
     );
   </script>


Note that the documentation of RTMP servers tell you to set the *file* option in players like this:

* For FLV video: **file=clip** (without the *.flv* extension).
* For MP4 video: **file=mp4:clip.mp4** (with *mp4:* prefix).
* For MP3 audio: **file=mp3:song.mp3** (with *mp3:* prefix).
* For AAC audio: **file=mp4:song.aac** (with *mp4:* prefix).

You do not have to do this with the JW Player, since the player takes care of stripping the extension and/or adding the prefix. If you do add the prefix yourself, the player will recognize it and not modify the URL.

Additionally, the player will leave querystring variables (e.g. for certain CDN security mechanisms) untouched. It basically ignores everything after the **?** character. However, because of the way options are :ref:`loaded <options>` into Flash, it is not possible to plainly use querystring delimiters (*?*, *=*, *&*) inside the *file* or *streamer* option. This issue can be circumvented by :ref:`URL encoding these characters <options>`.

.. note::

   Amazon Cloudfront's private streaming protocol is an example in which the MP4 URL should be URL Encoded, since the long security hash appended to the video URL can contain special characters.


Playlists
---------

RTMP streams can also be included in playlists, by leveraging the :ref:`JWPlayer namespace <playlistformats>`. The *streamer*  option should be set for every RTMP entry in a playlist. You don't have to set them in the embed code (just point the *file* option to your playlist).

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

Instead of the *enclosure* element, you can also use the *media:content* or *jwplayer:file* element. You could even set the *enclosure* to a regular http download of the video ánd *jwplayer:file* to the RTMP stream. That way, this single feed is useful for both regular RSS readers and the JW Player. More info in :ref:`playlistformats`.

.. note::

   Do not forget the **xmlns** at the top of the feed. It is needed by the player (and any other feed reader you might use) to understand the *jwplayer:* elements.


Live Streaming
--------------

A unique feature of RTMP is the ability to do live streaming, e.g. of presentations, concerts or sports events. Next to the player and an RTMP server, one then also needs a small tool to *ingest* (upload) the live video into the server. There's a bunch of such tools available, but the easiest to use is the (free) `Flash Live Media Encoder <http://www.adobe.com/products/flashmediaserver/flashmediaencoder/>`_. It is available for Windows and Mac.

A live stream can be embedded in the player using the same options as an on-demand stream. The only difference is that a live stream has no file extension. Example:

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     var flashvars = { 
       file:'livepresentation',
       streamer:'rtmp://www.myserver.com/live/'
     };

     swfobject.embedSWF('player.swf','container','480','270','9.0.115','false', flashvars, 
      {allowfullscreen:'true',allowscriptaccess:'always'},
      {id:'jwplayer',name:'jwplayer'}
     );
   </script>


Subscribing
^^^^^^^^^^^

When streaming live streams using the Akamai, Edgecast or Limelight CDN, players cannot simply connect to the live stream. Instead, they have to *subscribe* to it, by sending an **FCSubscribe call** to the server. The JW Player includes support for this functionality. Simply add the *rtmp.subscribe=true* option to your embed code to enable:

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     var flashvars = {
       file:'livepresentation',
       streamer:'rtmp://www.myserver.com/live/',
       'rtmp.subscribe':'true'
     };

     swfobject.embedSWF('player.swf','container','480','270','9.0.115','false', flashvars, 
      {allowfullscreen:'true',allowscriptaccess:'always'},
      {id:'jwplayer',name:'jwplayer'}
     );
   </script>


DVR Live Streaming
^^^^^^^^^^^^^^^^^^

Flash Media Server 3.5 introduced live DVR streaming - the ability to pause and seek in a live stream. A DVR stream acts like a regular on-demand stream, the only difference being that the *duration* of the stream keeps increasing (that is, when the stream is still recording).

Instead of starting from the beginning, the player will automatically jump to the *live* head of the DVR stream, so users can jump right into a live event. Subsequently, they are able to seek back to the beginning.

In order to enable DVR streaming you should:

* Install the **DVRCast** application (which is provided for free by Adobe) onto your FMS3.5 server. Certain Content Delivery Networks (like `Edgecast <http://edgecast.com/>`_) have this application already installed for you.
* Use a live stream publishing tool (such as Adobe's Flash Media Live Encoder 3.1) that can issue DVR recording commands to an RTMP server.
* Set the option **rtmp.dvr=true**. to your JW Player. This option switches the player in **DVRCast** mode, attempting to DVR subscribe to the stream and increasing the duration of the stream if recording is still in progress.

Here is an example embed code, with the *rtmp.dvr* option set:

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     var flashvars = {
       file:'livepresentation',
       streamer:'rtmp://www.myserver.com/live/',
       'rtmp.dvr':'true'
     };

     swfobject.embedSWF('player.swf','container','480','270','9.0.115','false', flashvars, 
      {allowfullscreen:'true',allowscriptaccess:'always'},
      {id:'jwplayer',name:'jwplayer'}
     );
   </script>


Dynamic Streaming
-----------------

Like :ref:`httpstreaming`, RTMP Streaming includes the ability to dynamically optimize the video quality for each individual viewer. Adobe calls this mechanism *dynamic streaming*. This functionality is supported for FMS 3.5+ and Wowza 2.0+.

To use dynamic streaming, you need multiple copies of your MP4 or FLV video, each with a different quality (dimensions and bitrate). These multiple videos are loaded into the player using an mRSS playlist (see example right below) or SMIL file (see :ref:`loadbalancing`) The player recognizes the various *levels* of your video and automatically selects the highest quality one that:

* Fits the *bandwidth* of the server » client connection.
* Fits the *width* of the player's display (or, to be precise, is not more than 20% larger).
* Results in less than 25% *frames dropped* at any point in time (e.g. 7fps for a video that is 25fps).

As a viewer continues to watch the video, the player re-examines its decision (and might switch) in response to certain events:

* On a **bandwidth** increase or decrease - the bandwidth is re-calculated at an interval of 2 seconds.
* On a **resize** of the player. For example, when a viewer goes fullscreen and has sufficient bandwidth, the player might serve an HD version of the video.
* On a **framedrop** of more than about 7 or 8 fps. 

Framedrop is continously monitored. Spikes are ruled out by taking 5-second averages. Once a quality level results in too large a framedrop, it will be *blacklisted* (made unavailable) for 30 seconds. After 30 seconds, it will be made available again, since the framedrop might be a result of a very decoding-heavy section in the video or external forces (e.g. the user opening Microsoft Office ;).

Unlike with :ref:`httpstreaming`, a dynamic streaming switch is unobtrusive. There'll be no re-buffering or audible/visible hickup. It does take a few seconds for a switch to occur in response to a bandwidth change / player resize, since the server has to wait for a *keyframe* to do a smooth switch and the player always has a few seconds of the old stream in its buffer. To keep stream switches fast, make sure your videos are encoded with a small (2 to 4 seconds) keyframe interval.

.. note:: 

   So far, we have not been able to combine dynamic streaming with live streaming. This functionality is highlighted in  documentation from FMS, but in our tests we found that the bandwidth the player receives never exceeds the bandwidth of the level that currently plays. In other words: the player will never switch to a higher quality stream than the one it starts with.


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
           <media:content bitrate="1800" url="videos/Qvxp3Jnv-486.mp4"  width="1280" />
           <media:content bitrate="1100" url="videos/Qvxp3Jnv-485.mp4" width="720"/>
           <media:content bitrate="700" url="videos/Qvxp3Jnv-484.mp4" width="480" />
           <media:content bitrate="400" url="videos/Qvxp3Jnv-483.mp4" width="320" />
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


.. _loadbalancing:

Load Balancing
--------------

For high-volume publishers who maintain several RTMP servers, the player supports load-balancing by means of an intermediate XML file. This is used by e.g. the `Highwinds <http://www.highwinds.com/>`_ and `Streamzilla <http://www.streamzilla.eu>`_  CDNs. Load balancing works like this:

* The player first requests the XML file (typically from a single *master* server).
* The server returns the XML file, which includes the location of the RTMP server to use (typically the server that's least busy) and the location of the videos on this server.
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

Here's an example embed code for enabling this functionality in the player. Note the *provider=rtmp* :ref:`option <options>` is needed in addition to *rtmp.loadbalance*, since otherwise the player thinks the XML file is a playlist.

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     var flashvars = {
       file:'http://www.mycdn.com/videos/myVideo.mp4.xml',
       provider:'rtmp',
       'rtmp.loadbalance':'true'
     };

     swfobject.embedSWF('player.swf','container','480','270','9.0.115','false', flashvars, 
      {allowfullscreen:'true',allowscriptaccess:'always'},
      {id:'jwplayer',name:'jwplayer'}
     );
   </script>


Playlists
^^^^^^^^^

RTMP Load balancing in playlists works in a similar fashion: the *provider=rtmp* and *rtmp.loadbalance=true* options can be set for every entry in the playlist that uses loadbalancing. Here's an example with one item:

.. code-block:: xml

   <rss version="2.0" xmlns:jwplayer="http://developer.longtailvideo.com/">
     <channel>
       <title>Playlist with RTMP loadbalancing</title>
   
       <item>
         <title>Big Buck Bunny (podcast)</title>
         <description>Big Buck Bunny is a short animated film by the Blender Institute, 
            part of the Blender Foundation.</description>
         <enclosure url="http://www.mycdn.com/videos/bbb.mp3.xml" type="text/xml" length="185" />
         <jwplayer:provider>rtmp</jwplayer:provider>
         <jwplayer:rtmp.loadbalance>true</jwplayer:rtmp.loadbalance>
       </item>
   
     </channel>
   </rss>

See the playlist section above for more information on format and element support.


Dynamic Streaming
^^^^^^^^^^^^^^^^^

The dynamic streaming mechanism of FMS 3.5+ and Wowza 2.0+ can be used in combination with load balancing. Therefore, simply add the different levels of your video to the SMIL file. Here's an example again:

.. code-block:: html

   <smil> 
     <head> 
       <meta base="rtmp://server1234.mycdn.com/ondemand/" /> 
     </head> 
     <body> 
       <switch>
         <video src="videos/Qvxp3Jnv-486.mp4" system-bitrate="1800000" width="1280" />
         <video src="videos/Qvxp3Jnv-485.mp4" system-bitrate="1100000" width="720"/> 
         <video src="videos/Qvxp3Jnv-484.mp4" system-bitrate="700000" width="480"/> 
         <video src="videos/Qvxp3Jnv-483.mp4" system-bitrate="400000" width="320"/> 
       </switch>
     </body> 
   </smil>

A couple of hints:

* This file is structured, and behaves exactly the same as the one Adobe uses in its `dynamic streaming documentation <http://www.adobe.com/devnet/flashmediaserver/articles/dynstream_advanced_pt1.html>`_. The *width* attributes of the various bitrate levels are not required (though preferred) by the JW Player.
* Opposed to a *regular* loadbalancing SMIL document, a dynamic streaming SMIL contains a *<switch>* statement directly inside the <body>* element. Include the closing *</switch>* as well!
* Opposed to MediaRSS feeds, the bitrate attributes of the various levels are set in *bitspersecond*, **not** in *kilobitspersecond*.



.. _rtmpt:

RTMPT Fallback
--------------

A frequent issue with RTMP streaming is the protocol being blocked by corporate firewalls. RTMP uses the UDP transmission protocol over port 1935, whereas regular HTTP traffic uses the TCP protocol over port 80.

All current-day RTMP servers have a way to circumvent this issue, by **tunnelling** the RTMP data in HTTP packets, over TCP and port 80. Performance will degrade - especially the buffer times, which may double - but the video can be pushed through corporate firewalls.

The 5.3 player introduced a mechanism that automatically detects and circumvents firewall issues for RTMP streaming. Here's how it works:

* First, the player connects to the regular application over port 1935, either RTMP or RTMPe (encrypted).
* Half a second later, the player connects to the same application over a tunneled connection on port 80, either RTMPT or RTMPTe (tunneled and encrypted). If port 80 is not available, Flash will interally re-try the tunneled connection over port 443 (HTTPS).
* Whichever connection is established first (the regular or the tunneled one) is used for streaming the video. The other connection is closed.

In most cases the player is connected to the application over RTMP within 500 milliseconds, cancelling the second connection. This functionality is fully automated (no need to set port numbers or rtmp **t** in your *streamer* flashvar) and works for all flavors of RTMP streaming (on-demand, live, dvr and dynamic).
