.. _http:

HTTP Pseudostreaming
====================

Both MP4 and FLV videos can be played back with a mechanism called HTTP Pseudostreaming. This mechanism allows your viewers to seek to not-yet downloaded parts of a video. Youtube is an example site that offers this functionality. HTTP pseudostreaming is enabled by setting the :ref:`option <options>` *type=http* in your player.

HTTP pseudostreaming combines the advantages of straight HTTP downloads (it passes any firewall, viewers on bad connections can simply wait for the download) with the ability to seek to non-downloaded parts. The only drawbacks of HTTP Pseudostreaming compared to Flash's official :ref:`rtmp` are its reduced security (HTTP is easier to sniff than RTMP) and long loading times when seeking in large videos (> 15 minutes).

HTTP Pseudostreaming should not be confused with HTTP Dynamic Streaming. The latter is a brand-new mechanism currently being developed by Adobe that works by chopping up the original video in so-called *chunks* of a few seconds each. The videoplayer seamlessly glues these chunks together again. This version of the JW Player does **not** support HTTP Dynamic Streaming.


Servers
-------

HTTP Pseudostreaming does not work by default on any webserver. A serverside module is needed to enable it. Here are the two most widely used (and open source) modules for this:

* The `H264 streaming module <http://h264.code-shop.com/trac/wiki>`_ for Apache, Lighttpd, IIS and NginX. It supports MP4 videos.
* The `FLV streaming module <http://blog.lighttpd.net/articles/2006/03/09/flv-streaming-with-lighttpd mod_flv_streaming module>`_ for Lighttpd. It supports FLV videos.

Several CDN's (Content Delivery Networks) support HTTP Pseudostreaming as well. We have done succesfull tests with `Bitgravity <http://www.bitgravity.com>`_, `CDNetworks <http://www.cdnetworks.com>`_, `Edgecast <http://www.edgecastcdn.com>`_ and `Limelight <http://llnw.com>`_.

Instead of using a serverside module, pseudostreaming can also be enabled by using a serverside script (in e.g. PHP or .NET). We do not advise this, since such a script consumes a lot of resources, has security implications and can only be used with FLV files. A much-used serverside script for pseudostreaming is `Xmoov-PHP <http://xmoov.com/xmoov-php/>`_.


Mechanism
---------

Under water, HTTP pseudostreaming works as follows:

When the video is initially loaded, the player reads and stores a list of *seekpoints* as part of the video's metadata. These seekpoints are offsets in the video (both in seconds and in bytes) at which a new *keyframe* starts. At these offsets, a request to the server can be made.

When a user seeks to a not-yet-downloaded part of the video, the player translates this seek to the nearest seekpoint. Next, the player does a request to the server, with the seekpoint offset as a parameter. For FLV videos, the offset is always provided in bytes:

.. code-block:: html

   http://www.mywebsite.com/videos/bbb.flv?start=219476905

For MP4 videos, the offset is always provided in seconds:

.. code-block:: html

   http://www.mywebsite.com/videos/bbb.mp4?starttime=30.4

The server will return the video, starting from the offset. Because the first frame in this video is a keyframe, the player is able to correctly load and play it. Should the server have returned the video from an arbitrary offset, the player would not be able to pick up the stream and the display would only show garbage.

.. note::

     Some FLV encoders do not include seekpoints metadata when encoding videos. Without this data, HTTP Pseudostreaming will not work. If you suspect your videos to not have metadata, use our `Metaviewer plugin <http://www.longtailvideo.com/addons/plugins/64/Metaviewer>`_ to inspect the video. There should be a *seekpoints* or *keyframes* list. If it is not there, use the `FLVMDI tool <http://www.buraks.com/flvmdi/>`_ to parse your FLV videos and inject this metadata.


Startparam
----------

When the player requests a video with an offset, it uses *start* as the offset parameter name for FLV videos and *starttime* as the offset parameter name for MP4 videos:

.. code-block:: html

   http://www.mywebsite.com/videos/bbb.flv?start=219476905
   http://www.mywebsite.com/videos/bbb.mp4?starttime=30.4

These names are most widely used by serverside modules and CDNs. However, sometimes a CDN might use a different name for this parameter. In that case, use the option *http.startparam* to set a custom offset parameter name. Here are some examples of CDNs that use a different name:

* `Bitgravity <http://www.bitgravity.com>`_ uses *http.startparam=apstart* for MP4 videos.
* `Edgecast <http://www.edgecastcdn.com>`_ uses *http.startparam=ec_seek* for FLV videos.
* `Limelight <http://llnw.com>`_ uses *http.startparam=fs* for FLV videos.

Here's what an example SWFObject :ref:`embed code <embed>` looks like when both HTTP Pseudostreaming and a custom start parameter is enabled:

.. code-block:: html

   <div id='container'>The player will be placed here</div>

   <script type="text/javascript">
     swfobject.embedSWF('player.swf','container','480','270','9.0.115','false',{
       file:'http://bitcast-a.bitgravity.com/botr/bbb.mp4',
       type:'http',
       'http.startparam':'apstart'
     });
   </script>


Playlists
---------

HTTP Pseudostreaming can also be enabled in playlists, by leveraging the :ref:`JWPlayer namespace <playlists>`. Both the *type* and *http.startparam* options can be set for every entry in a playlist. In this case, you don't have to set them in the embed code (just point the *file* to your playlist).

Here's an example, an RSS feed with a single video:

.. code-block:: xml

   <rss version="2.0" xmlns:jwplayer="http://developer.longtailvideo.com/">
     <channel>
       <title>Playlist with HTTP Pseudostreaming</title>
   
       <item>
         <title>Big Buck Bunny</title>
         <description>Big Buck Bunny is a short animated film by the Blender Institute, 
            part of the Blender Foundation.</description>
         <enclosure url="http://myserver.com/botr/bbb.mp4" type="video/mp4" length="3192846" />
         <jwplayer:type>http</jwplayer:type>
         <jwplayer:http.startparam>apstart</jwplayer:http.startparam>
   
       </item>
     </channel>
   </rss>

Instead of the *enclosure* element, you can also use the *media:content* or *jwplayer:file* element. More info in :ref:`playlists`.

.. note::

   Do not forget the **xmlns** at the top of the feed. It is needed by the player (and any other feed reader you might use) to understand the *jwplayer:* elements.


Bitrate Switching
-----------------

Like with :ref:`rtmp`, HTTP Pseudostreaming includes the ability to dynamically optimize the video quality for each individual viewer. We call this mechanism *bitrate switching*.

To use bitrate swiching, you need multiple copies of your MP4 or FLV video, each with a different quality (dimensions and bitrate). These multiple videos are loaded into the player using an mRSS playlist (see example below). The player recognizes the various *levels* of your video and automatically selects the highest quality one that:

* Fits the *bandwidth* of the server » client connection.
* Fits the *width* of the player's display (or, to be precise, is not more than 20% larger).

As a viewer continues to watch the video, the player re-examines its decision (and might switch) in response to certain events:

* On **startup**, immediately after it has calculated the bandwidth for the first time.
* On a **fullscreen** switch, since the *width* of the display then drastically changes. For example, when a viewer goes fullscreen and has sufficient bandwidth, the player might serve an HD version of the video.
* On every **seek** in the video. Since the player has to rebuffer-the stream anyway, it takes the opportunity to also check if bandwidth conditions have not changed.

Note that the player will not do a bandwidth switch if extreme bandwidth changes cause the video to re-buffer. In practice, we found such a heuristic to cause continous switching and an awful viewing experience.


Example
^^^^^^^

Here is an example bitrate switching playlist (only one item). Note that it is similar to a *regular* HTTP Pseudostreaming playlist, with the exception of the multiple video elements per item. The mRSS extension is the only way to provide these multiple elements including *bitrate* and *width* attributes:

.. code-block:: xml

   <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:jwplayer="http://developer.longtailvideo.com/">
     <channel>
       <title>Playlist with HTTP Bitrate Switching</title>
   
       <item>
         <title>Big Buck Bunny</title>
         <description>Big Buck Bunny is a short animated film by the Blender Institute, 
            part of the Blender Foundation.</description>
         <media:group>
           <media:content bitrate="1800" url="http://myserver.com/bbb-4.mp4"  width="1280" />
           <media:content bitrate="1100" url="http://myserver.com/bbb-3.mp4" width="720"/>
           <media:content bitrate="700" url="http://myserver.com/bbb-2.mp4" width="480" />
           <media:content bitrate="400" url="http://myserver.com/bbb-1.mp4" width="320" />
         </media:group>
         <jwplayer:type>http</jwplayer:type>
         <jwplayer:http.startparam>apstart</jwplayer:http.startparam>
       </item>
   
     </channel>
   </rss>

Some hints:

* The *bitrate* attributes must be in kbps, as defined by the `mRSS spec <http://video.search.yahoo.com/mrss>`_. The *width* attribute is in pixels.
* It is recommended to order the streams by quality, the best one at the beginning. Most RSS readers will pick this one.
* The four levels displayed in this feed are actually what we recommend for bitrate switching of widescreen MP4 videos. For 4:3 videos or FLV videos, you might want to increase the bitrates or decrease the dimensions a little.
* Some publishers only modify the bitrate when encoding multiple levels. The player can work with this, but modifying both the bitrate + dimensions allows for more variation between the levels (and re-use of videos, e.g. the smallest one for streaming to phones).
* The *media:group* element here is optional, but it organizes the video links a little.
