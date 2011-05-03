.. _embed:

Embedding the Player
====================

As of version 5.3, the JW Player features its own embedding method. While external embed methods like `SWFObject <http://code.google.com/p/swfobject/>`_ can still be used, the built-in embed method has a couple of awesome features:

* Complete integration of Flash and HTML5 player.
* Super easy to use :ref:`javascript API <api>`.



Getting started
---------------

Embedding the JW Player in your website is a simple, 3-step process:

1. Upload the *jwplayer.js* and *jwplayer.swf* files from the download ZIP to your server. All other files in the download (documentation, source code, etc) are optional.
2. Include the *jwplayer.js* somewhere in the head of your website:
    
    .. code-block:: html
        
        <script type="text/javascript" src="/jwplayer/jwplayer.js"></script>
    
3. Call the player setup somewhere in the body of your website. Here's a basic example:

    .. code-block:: html
    
        <div id="container">Loading the player ...</div>
    
        <script type="text/javascript">
            jwplayer("container").setup({
                flashplayer: "/jwplayer/jwplayer.swf",
                file: "/uploads/video.mp4",
                height: 270,
                width: 480
            });
        </script>

When the page is loading, the JW Player is automatically instantiated on top of the *<div>*. By default, the player is rendered in Flash. If Flash is not supported (e.g. on an iPad), the player is rendered in HTML5.

The *flashplayer* option (to tell the javascript where the SWF resides) is just one of many `configuration options <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12536/configuration-options>`_ available for configuring the JW Player.

Here's another setup example, this time using a *<video>* tag instead of a generic div:

.. code-block:: html

    <video 
        file="/uploads/video.mp4" 
        height="270" 
        id="container" 
        poster="/uploads/image.jpg"
        width="480">
    </video>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf"
        });
    </script>

In this case, the JW Player is actually inspecting the :ref:`video tag <videotag>` and loading its attributes as configuration options. It's a useful shortcut for setting up a basic player.


Setup Syntax
------------

Let's take a closer look at the syntax of the *setup()* call. It has the following structure:

.. code-block:: html
    
    jwplayer(container).setup([options]);

In this block, the *container* is the DOM element(*<video>* or *<div>*, *<p>*, etc.) you want to load the JW Player into. If the element is a *<video>* tag, the attributes of that tag (e.g. the *width* and *src*) are loaded into the player. For a full overview of the *<video>* tag, see our :ref:`videotag`.

The *options* are the list of configuration options for the player. The `configuration options guide <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12536/configuration-options>`_ contains the full overview. Here's an example with a bunch of options:

.. code-block:: html

    <div id="container">Loading the player ...</video>

    <script type="text/javascript">
        jwplayer("container").setup({
            autostart: true,
            controlbar: "none",
            file: "/uploads/video.mp4",
            duration: 57,
            flashplayer: "/jwplayer/jwplayer.swf",
            skin: "/uploads/modieus.zip",
            volume: 80,
            width: 720
        });
    </script>

Though generally a flat list, there are a couple of options that can be inserted as structured blocks inside the setup method. Each of these blocks allow for quick but powerful setups:

* **playlist**: allows inline setup of a full playlist, including metadata.
* **levels**: allows inline setup of multiple quality levels of a video, for bitrate switching purposes.
* **plugins**: allows inline setup of `JW Player plugins <http://www.longtailvideo.com/addons/plugins/>`_, including their configuration options.
* **events**: allows inline setup of javascripts for player events, e.g. when you want to do something when the player starts.
* **players**: allows inline setup of a custom player fallback, e.g. HTML5 first, fallback to Flash.

The sections below explain them in detail.



.. _embed_playlist:

Playlist
--------

Previously, loading a playlist in the JW Player was only available by using an `XML playlist format <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12537/xml-playlist-support>`_ like RSS or ATOM. With the JW Player embed method though, it is possible to load a full playlist into the player using the **playlist** object block.

Here is an example. In it, a playlist of three items is loaded into the player. Each item contains a **duration** hint, the **file** location and the location of a poster **image**. 


.. code-block:: html

    <div id="container">Loading the player...</div>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
            playlist: [
                { duration: 32, file: "/uploads/video.mp4", image: "/uploads/video.jpg" },
                { duration: 124, file: "/uploads/bbb.mp4", image: "/uploads/bbb.jpg" },
                { duration: 542, file: "/uploads/ed.mp4", image: "/uploads/ed.jpg" }
            ],
            "playlist.position": "right",
            "playlist.size": 360,
            height: 270,
            width: 720
        });
    </script>

.. note::

    The *playlist.position* and *playlist.size* options control the visible playlist inside the Flash player. To date, the HTML5 player doesn't support a visible playlist yet (though it can manage a playlist of videos).

A playlist can contain 1 to many videos. For each entry, the  following properties are supported:

* **file**: this one is required (unless you have *levels*, see below). Without a video to play, the playlist item is skipped. 
* **image**: location of the poster image. Is displayed before the video starts, after it finishes, and as part of the graphical playlist.
* **duration**: duration of the video, in seconds. The player uses this to display the duration in the controlbar, and in the graphical playlist.
* **start**: starting point inside the video. When a user plays this entry, the video won't start at the beginning, but at the offset you present here.
* **title**: title of the video, is displayed in the graphical playlist.
* **description**: description of the video, is displayed in the graphical playlist.
* **streamer**: streaming application to use for the video. This is only used for `RTMP <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12535/video-delivery-rtmp-streaming>`_ or `HTTP <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12534/video-delivery-http-pseudo-streaming>`_ streaming.
* **provider**: specific media playback API (e.g. *http*, *rtmp* or *youtube*) to use for playback of this playlist entry.
* **levels**: a nested object block, with multiple quality levels of the video. See the *levels* section for more info.



Levels
------

The **levels** object block allows you to load multiple quality levels of a video into the player. The multiple levels are used by the Flash player (HTML5 not yet) for `RTMP <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12535/video-delivery-rtmp-streaming>`_ or `HTTP <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12534/video-delivery-http-pseudo-streaming>`_ bitrate switching. Bitrate switching is a mechanism where the player automatically shows the best possible video quality to each viewer.

Here's an example setup, using RTMP bitrate switching (also called *dynamic streaming*). Note the additional *streamer* option, which tells the player the location of the RTMP server:

.. code-block:: html

    <div id="container">Loading the player...</div>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
                height: 270,
                width: 480,
                image: "/uploads/video.jpg",
                levels: [
                    { bitrate: 300, file: "assets/bbb_300k.mp4", width: 320 },
                    { bitrate: 600, file: "assets/bbb_600k.mp4", width: 480 },
                    { bitrate: 900, file: "assets/bbb_900k.mp4", width: 720 }
                ],
                provider: "rtmp",
                streamer: "rtmp://mycdn.com/application/"
        });
    </script>


Here is another example setup, this time using HTTP bitrate switching. The HTTP switching is enabled by setting the *provider* option to *http*:

.. code-block:: html

    <div id="container">Loading the player...</div>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
            height: 270,
            width: 480,
            image: "/uploads/video.jpg",
            levels: [
                { bitrate: 300, file: "http://mycdn.com/assets/bbb_300k.mp4", width: 320 },
                { bitrate: 600, file: "http://mycdn.com/assets/bbb_600k.mp4", width: 480 },
                { bitrate: 900, file: "http://mycdn.com/assets/bbb_900k.mp4", width: 720 }
            ],
            provider: "http",
            "http.startparam":"starttime"
        });
    </script>



Plugins
-------

Plugins can be used to stack functionality on top of the JW Player. A wide array of plugins is available `in our library <http://www.longtailvideo.com/addons/plugins/>`_, for example for viral sharing, analytics or advertisements.

Here is an example setup using both the `HD plugin <http://www.longtailvideo.com/addons/plugins/65/HD>`_ and the `Google Analytics Pro plugin <http://www.longtailvideo.com/addons/plugins/107/Google-Analytics-Pro>`_:


.. code-block:: html

    <div id="container">Loading the player...</div>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
            file: "/uploads/video.mp4",
            height: 270,
            plugins: {
                hd: { file: "/uploads/video_high.mp4", fullscreen: true },
                gapro: { accountid: "UKsi93X940-24" }
            },
            image: "/uploads/video.jpg",
            width: 480
        });
        </script>

Here is another example, using the `sharing plugin <http://www.longtailvideo.com/addons/plugins/110/Sharing>`_. In this example, plugin parameters are also included in the playlist block:

.. code-block:: html

    <div id="container">Loading the player...</div>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
            playlist: [
                { file: "/uploads/bbb.mp4", "sharing.link": "http://bigbuckbunny.org" },
                { file: "/uploads/ed.mp4", "sharing.link": "http://orange.blender.org" }
            ],
            plugins: {
                sharing: { link: true }
            },
            height: 270,
            width: 720
        });
    </script>



.. _embed_events:

Events
------

The **events** block allows you to respond on player events in javascript. It's a short, powerful way to add player - pager interactivity. Here is a swift example:

.. code-block:: html
    
    <div id="container">Loading the player ...</div>
    
    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            events: {
                onComplete: function() { alert("the video is finished!"); }
            }
        });
    </script>

Here is another example, with two event handlers. Note the *onReady()* handler autostarts the player using the *this* statement and the *onVolume()* handler is processing an event property:

.. code-block:: html
    
    <div id="container">Loading the player ...</div>
    
    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            events: {
                onReady: function() { this.play(); },
                onVolume: function(event) { alert("the new volume is "+event.volume); }
            }
        });
    </script>

See the :ref:`API reference <api>` for a full overview of all events and their properties.


Players
-------

The **players** option block can be used to customize the order in which the JW Player uses the different browser technologies for rendering the player. By default, the JW Player uses this order:

1. The **Flash** plugin.
2. The **HTML5** <video> tag.
3. A plain **download** link.

Using the **players** block, it is possible to e.g. try to used the HTML5 player first:

.. code-block:: html
    
    <div id="container">Loading the player ...</div>
    
    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            players: [
                { type: "html5" },
                { type: "flash" },
                { type: "download" }
            ]
        });
    </script>


Here is another variation. This time, the player source is also included in the *players* block, and the video download fallback is discarded:

.. code-block:: html
    
    <div id="container">Loading the player ...</div>
    
    <script type="text/javascript">
        jwplayer("container").setup({
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            players: [
                { type: "html5" },
                { type: "flash", src: "/jwplayer/jwplayer.swf" }
            ]
        });
    </script>


Player Removal
--------------

In addition to setting up a player, the JW Player embed script contains a function to unload a player. It's very simple:

.. code-block:: html

    jwplayer("container").remove();

This formal **remove()** function will make sure the player stops its streams, the DOM is re-set to its original state and all event listeners are cleaned up.