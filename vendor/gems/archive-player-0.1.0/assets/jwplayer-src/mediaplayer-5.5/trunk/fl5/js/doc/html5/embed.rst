.. _embed:

Embedding the player
====================

Embedding the HTML5 player into a page is essentially a two-step process: first, include the JWPlayer javascripts and second, invoke the JW Player method upon certain video tag.

Basic example
-------------

To Embed the HTML5 Player include the *jquery.js* and *jquery.jwplayer.js* scripts into the *<head>* of a page. This can be done with the following code:

.. code-block:: html

   <script type="text/javascript" 
     src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
   <script type="text/javascript" src="/scripts/jquery.jwplayer.js"></script>


If you already use the `jQuery library <http://jquery.com/>`_ on your page, make sure to not include it twice. The JW Player works with jQuery version 1.3 and above. 

Second, instantiate the player over one or more video tags. Here is an example:

.. code-block:: html

   <video id="myplayer" src="/files/bunny.mp4" width="480" height="270"></video>

   <script type="text/javascript">
     $('#myplayer').jwplayer({
       flashplayer:'/files/player.swf',
       skin:'/files/five.xml'
     });
   </script>

The player here is instantiated using two options, for telling it where the skin (graphics) and the flashplayer (for browsers that don't support HTML5) are located. There are several more options available: :ref:`here is the full list <options>`. 

**Note that the skin option is required for the beta version of this player.**

Fallbacks
---------

When the player detects that none of the source videos can be played, it can fall back to an instance of the `JW Player for Flash <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5>`_. The player will look exactly the same, since the flashplayer loads the same skin element. This is a very exciting feature, since it allows you to use the HTML5 video tag today without losing support for such browsers as Internet Explorer 6, 7 and 8. 

If Adobe Flash is not supported by the browser (or if you disabled the :ref:`flashplayer option <options>`), the player will fall back to only displaying the poster image. When clicking this image, the video file will be downloaded, allowing users to playback the video with a local player.


Multiple Sources
----------------

Video tags with multiple nested *<source>* tags are also supported by the player. A typical setup is one where an H264/AAC video is provided for playback in Safari/Chrome and a Theora/Vorbis video is provided for playback in Firefox/Opera:

.. code-block:: html

   <video width="480" height="270" id="myplayer">
     <source src="/files/bunny.mp4" type="video/mp4" />
     <source src="/files/bunny.ogv" type="video/ogg" />
   </video>

The player tries to playback the *<source>* videos in order of appearance. So with the above example, if a browsers supports both H264/AAC and Theora/Vorbis (e.g. Google Chrome), the first option (H264/AAC) will be played. 

If no mimetypes and/or codecs are provided, the player assumes H264/AAC for files with .mp4 and .mov extensions and Theora/Vorbis for files with .ogv and .ogg extensions. See :ref:`formats` for a full list of supported media formats.

Multiple Players
----------------

Technically, instantiating the player is a matter of calling the *jwplayer()* function on a `jQuery selector <http://api.jquery.com/category/selectors/>`_. For example, here we apply the player to all <video> elements on the page, setting the skin and mute configuration options:


.. code-block:: html

   <video src="/files/bunny.mp4" width="480" height="270"></video>
   <video src="/files/corrie.mp4" width="480" height="270"></video>

   <script type="text/javascript">
     $('video').jwplayer({
       mute: true,
       skin:'/files/five.xml'
     });
   </script>

Here is another example, in which two players are instantiated, each with their own settings:

.. code-block:: html

   <video id="video1" src="/files/bunny.mp4" width="480" height="270"></video>
   <video id="video2" src="/files/corrie.mp4" width="480" height="270"></video>

   <script type="text/javascript">
     $('#video1').jwplayer({
       autostart:true,
       skin:'/files/five.xml'
     });
     $('#video2').jwplayer({
       autostart:false,
       skin:'/files/stormtrooper.xml'
     });
   </script>

Full jQuery selector support is available. However, make sure your video tag contains an ID attribute if you want to interact with it using the API.