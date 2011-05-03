.. _embedding:

Embedding the player
====================

Like every other Flash object, the JW Player has to be embedded into the HTML of a webpage using specific embed codes. Overall, there are three methods for embedding the JW Player: 

* Using a generic JavaScript embedder (like `SWFObject <http://code.google.com/p/swfobject/>`_).
* Using a HTML tag (like *<object>* or *<embed>*).
* Using the JW Embedder, the JW Player's own JavaScript embedder (**jwplayer.js**).

For embedding the JW Player for Flash, we recommend using SWFObject, since it works in all browsers and many examples exist on the web to get you up and running quickly.  If you want the new HTML5 features of the JW Player, or if you want to leverage the new and improved :ref:`JavaScript API <javascriptapi>`, you'll want to use the JW Embedder.  Detailed instructions can be found below.

Upload
------

First, a primer on uploading. This may sound obvious, but for the JW Player to work on your website, you must upload the *player.swf* file onto your webserver.  If you want to play YouTube videos, you must also upload the **yt.swf** file - this is the bridge between the player and YouTube.  Finally, to use the JW Embedder and HTML5 player, upload **jwplayer.js**.  

.. note::

	We recommend putting everything in a folder called "jwplayer" at the root of your site.  This enables the :ref:`quickembed` method of setting up the player.  The file structure should look like this:
	
.. code-block:: text

	[Web Root]/jwplayer/player.swf	
	[Web Root]/jwplayer/jwplayer.js	
	[Web Root]/jwplayer/yt.swf


SWFObject
---------

There's a wide array of good, open source libraries available for embedding Flash.  **SWFObject** is the most widely used one. It has `excellent documentation <http://code.google.com/p/swfobject/wiki/documentation>`_.

Before embedding any players on the page, make sure to include the *swfobject.js* script in the *<head>* of your HTML. You can download the script and host it yourself, or leverage the copy `provided by Google <http://code.google.com/apis/ajaxlibs/documentation/>`_:

.. code-block:: html

   <script type="text/javascript" 
     src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js">
   </script>

With the library set up, you can start embedding players. Here's an example:

.. code-block:: html

   <p id="container1">Please install the Flash Plugin</p>

   <script type="text/javascript">
     var flashvars = { file:'/data/bbb.mp4',autostart:'true' };
     var params = { allowfullscreen:'true', allowscriptaccess:'always' };
     var attributes = { id:'player1', name:'player1' };

     swfobject.embedSWF('player.swf','container1','480','270','9.0.115','false',
       flashvars, params, attributes);
   </script>

It's a fairly sizeable chunk of code that contains the embed *container*, *flashvars*, *params*, *attributes* and *instantiation*. Let's walk through them one by one:

* The *container* is the HTML element where the player will be placed into. It should be a block-level element, like a <p> or <div>. If a user has a sufficient version of Flash, the text inside the container is removed and replaced by the videoplayer. Otherwise, the contents of the container will remain visible.
* The *flashvars* object lists your player :ref:`options`. One option that should always be there is *file*, which points to the file to play. You can insert as many options as you want.
* The *params* object includes the `Flash plugin parameters <http://kb2.adobe.com/cps/127/tn_12701.html>`_. The two parameters in the example (our recommendation) enable both the *fullscreen* and *JavaScript* functionality of Flash.
* The *attributes* object include the HTML attributes of the player. We recommend always (and only) setting an *id* and *name*, to the same value. This will be the *id* of the player instance if you use its :ref:`javascriptapi`.
* The *instantiation* is where all things come together and the actual player embedding takes place. These are all parameters of the SWFObject call:

   * The URL of the *player.swf*, relative to the page URL.
   * The ID of the container you want to embed the player into.
   * The width of the player, in pixels. Note the JW Player automatically stretches itself to fit.
   * The height of the player, in pixels. Note the JW Player automatically stretches itself to fit.
   * The required version of Flash. We highly recommend setting *9.0.115*. This is the first version that supports :ref:`MP4 <mediaformats>` and is currently installed at >95% of all computers. The only feature for which you might restricted to *10.0.0* is :ref:`RTMP dynamic streaming <rtmpstreaming>`.
   * The location of a Flash auto-upgrade script. We recommend to **not** use it. People that do not have Flash 9.0.115 either do not want or are not able (no admin rights) to upgrade.
   * Next, the *flashvars*, *params* and *attributes* are passed, in that order.


It is no problem to embed multiple players on a page. However, make sure to give each player instance a different container **id** and a different attributess **id** and **name**.


Embedding Without JavaScript
----------------------------

In cases where a JavaScript embed method is not possible (e.g. if your CMS does not allow including JavaScripts), the player can be embedded using plain HTML. There are various combinations of tags for embedding Flash on a webpage:

* A single *<embed>* tag (for IE + other browsers).
* An *<object>* tag with nested *<embed>* tag (the first one for IE, the second for other browsers).
* An *<object>* tag with nested *<object>* tag (the first one for IE, the second for other browsers).

We recommend using the *<object>* tag with a nested *<embed>* tag. This works in the widest array of browsers, including older browsers such as Netscape. Here is an example embed code that does exactly the same as the SWFObject example above:

.. code-block:: html

	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="480" height="270" id="player1" name="player1">
	   <param name="movie" value="/jwplayer/player.swf">
	   <param name="allowfullscreen" value="true">
	   <param name="allowscriptaccess" value="always">
	   <param name="flashvars" value="file=/data/bbb.mp4&autostart=true">
	   <embed id="player1"
	          name="player1"
	          src="/jwplayer/player.swf"
	          width="480"
	          height="270"
	          allowscriptaccess="always"
	          allowfullscreen="true"
	          flashvars="file=/data/bbb.mp4&autostart=true"
	   />
	</object>

As you can see, most of the data of the SWFObject embed is also in here:

* The **container** is now the id of both the object embed tags. The *fallback* text cannot be used anymore.
* The **flashvars** are merged into a single string, and loaded as an attribute in each of the tags. You should always concatenate the flashvars using so-called querystring parameter encoding: *flashvar1=value1&flashvar2=value2&...*.
* The **params** and **attributes** from SWFObject are individual attributes of the embed tag, and *param* tags inside of the object tag.
* The **instantiation** options (source, width, height) are attributes of the embed and object tags. 

.. note:: 

   The Flash version reference is not in these tags: this is one of the drawbacks of this method: it's not possible to detect Flash and selectively hide it, e.g. if the flash version is not sufficient or if the device (iPad ...) doesn't support Flash.
   
For an interesting overview on the different embedding methods, `this article <http://www.alistapart.com/articles/flashembedcagematch/>`_ compares several methods, and provides a historical overview of the subject.  


JW Embedder
-----------

New in version 5.3, the JW Player features its own embedding method.  While the previous embed methods can still be used, the built-in embed method has a couple of useful features:

* Seamless failover between the Flash and HTML5 players.
* Automatic integration with the :ref:`JavaScript API <javascriptapi>`.

Getting started
+++++++++++++++

Embedding the JW Player in your website is a simple, 3-step process:

1. Upload the *jwplayer.js*, *player.swf* and *yt.swf* files from the download ZIP to your server. All other files in the download (documentation, source code, etc) are optional.
2. Include the *jwplayer.js* somewhere in the head of your webpage:
    
    .. code-block:: html
        
        <script type="text/javascript" src="/jwplayer/jwplayer.js"></script>
    
3. Call the player setup somewhere in the body of your website. Here's a basic example:

    .. code-block:: html
    
        <div id="container">Loading the player ...</div>
    
        <script type="text/javascript">
            jwplayer("container").setup({
                flashplayer: "/jwplayer/player.swf",
                file: "/uploads/video.mp4",
                height: 270,
                width: 480
            });
        </script>

When the page is loading, the JW Player is automatically instantiated on top of the *<div>*. By default, the player is rendered in Flash. If Flash is not supported (e.g. on an iPad), the player is rendered in HTML5.

The *flashplayer* option (to tell the JavaScript where the SWF resides) is just one of many `configuration options <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12536/configuration-options>`_ available for configuring the JW Player.

Here's another setup example, this time using a *<video>* tag instead of a generic div:

.. code-block:: html

    <video 
        src="/uploads/video.mp4" 
        height="270" 
        id="container" 
        poster="/uploads/image.jpg"
        width="480">
    </video>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/player.swf"
        });
    </script>

In this case, the JW Player is actually inspecting <video> tag and loading its attributes as configuration options. It's a useful shortcut for setting up a basic player.

.. _quickembed:

Quick Embed
___________

If you've uploaded your *player.swf* and *jwplayer.js* files to a folder called "jwplayer" in the root of your website, you can embed the player by using two simple lines of HTML:

    .. code-block:: html
        
        <script type="text/javascript" src="/jwplayer/jwplayer.js"></script>
        <video class="jwplayer" src="/uploads/video.mp4" poster="/uploads/image.jpg"></video>

That's it!  As long as you have everything in the right place, all <video> tags on your page whose class is **jwplayer** will be replaced on your page by the JW Player.


Setup Syntax
++++++++++++

Let's take a closer look at the syntax of the *setup()* call. It has the following structure:

.. code-block:: html
    
    jwplayer(container).setup({options});

In this block, the *container* is the DOM element(*<video>* or *<div>*, *<p>*, etc.) you want to load the JW Player into. If the element is a *<video>* tag, the attributes of that tag (e.g. the *width* and *src*) are loaded into the player.

The *options* are the list of configuration options for the player. The `configuration options guide <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12536/configuration-options>`_ contains the full overview. Here's an example with a bunch of options:

.. code-block:: html

    <div id="container">Loading the player ...</video>

    <script type="text/javascript">
        jwplayer("container").setup({
            autostart: true,
            controlbar: "none",
            file: "/uploads/video.mp4",
            duration: 57,
            flashplayer: "/jwplayer/player.swf",
            volume: 80,
            width: 720
        });
    </script>

Though generally a flat list, there are a couple of options that can be inserted as structured blocks inside the setup method. Each of these blocks allow for quick but powerful setups:

* **playlist**: allows inline setup of a full playlist, including metadata.
* **levels**: allows inline setup of multiple quality levels of a video, for bitrate switching purposes.
* **plugins**: allows inline setup of `JW Player plugins <http://www.longtailvideo.com/addons/plugins/>`_, including their configuration options.
* **events**: allows inline setup of JavaScripts for player events, e.g. when you want to do something when the player starts.
* **players**: allows inline setup of a custom player fallback, e.g. HTML5 first, fallback to Flash.

The sections below explain them in detail.

.. _embed_skinning:

Skins
+++++

The JW Player has a wide variety of skins that can be used to modify the look and feel of the player.  They can be downloaded from our `AddOns Library <http://www.longtailvideo.com/addons/skins>`_.

To embed a JW Player 5 skin, simply place the ZIP file on your web server and add the *skin* property to your embed code:

.. code-block:: html

    <div id="container">Loading the player ...</div>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/player.swf",
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            skin: "/skins/modieus/modieus.zip"
        });
    </script>

.. note::

	If you're configuring the Embedder to run primarily in HTML5 mode using the :ref:`embed_players` block, you'll need to take the additional step of unzipping the skin ZIP and uploading its contents to your web server in the same location as the ZIP file itself.  Your skin's folder structure would look something like this:

.. code-block:: text

 /skins/modieus/modieus.zip
 /skins/modieus/modieus.xml
 /skins/modieus/controlbar/
 /skins/modieus/playlist/
 etc.

.. _embed_playlist:

Playlist
++++++++

Previously, loading a playlist in the JW Player was only available by using an `XML playlist format <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12537/xml-playlist-support>`_ like RSS or ATOM. With the JW Player embed method though, it is possible to load a full playlist into the player using the **playlist** object block.

Here is an example. In it, a playlist of three items is loaded into the player. Each item contains a **duration** hint, the **file** location and the location of a poster **image**. 


.. code-block:: html

    <div id="container">Loading the player...</div>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/player.swf",
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
++++++

The **levels** object block allows you to load multiple quality levels of a video into the player. The multiple levels are used by the Flash player (HTML5 not yet) for `RTMP <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12535/video-delivery-rtmp-streaming>`_ or `HTTP <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/12534/video-delivery-http-pseudo-streaming>`_ bitrate switching. Bitrate switching is a mechanism where the player automatically shows the best possible video quality to each viewer.

Here's an example setup, using RTMP bitrate switching (also called *dynamic streaming*). Note the additional *streamer* option, which tells the player the location of the RTMP server:

.. code-block:: html

    <div id="container">Loading the player...</div>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/player.swf",
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
            flashplayer: "/jwplayer/player.swf",
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
+++++++

Plugins can be used to stack functionality on top of the JW Player. A wide array of plugins is available `in our library <http://www.longtailvideo.com/addons/plugins/>`_, for example for viral sharing, analytics or advertisements.

Here is an example setup using both the `HD plugin <http://www.longtailvideo.com/addons/plugins/65/HD>`_ and the `Google Analytics Pro plugin <http://www.longtailvideo.com/addons/plugins/107/Google-Analytics-Pro>`_:


.. code-block:: html

    <div id="container">Loading the player...</div>

    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/player.swf",
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
            flashplayer: "/jwplayer/player.swf",
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
++++++

The **events** block allows you to respond on player events in JavaScript. It's a short, powerful way to add player - pager interactivity. Here is a swift example:

.. code-block:: html
    
    <div id="container">Loading the player ...</div>
    
    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/player.swf",
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
            flashplayer: "/jwplayer/player.swf",
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            events: {
                onReady: function() { this.play(); },
                onVolume: function(event) { alert("the new volume is "+event.volume); }
            }
        });
    </script>

See the :ref:`API reference <javascriptapi>` for a full overview of all events and their properties.

.. _embed_players:

Players
+++++++

The **players** option block can be used to customize the order in which the JW Player uses the different browser technologies for rendering the player. By default, the JW Player uses this order:

1. The **Flash** plugin.
2. The **HTML5** <video> tag.

Using the **players** block, it is possible to specify that the Embedder try the HTML5 player first:

.. code-block:: html
    
    <div id="container">Loading the player ...</div>
    
    <script type="text/javascript">
        jwplayer("container").setup({
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            players: [
                { type: "html5" },
                { type: "flash", src: "/jwplayer/player.swf" }
            ]
        });
    </script>


Player Removal
++++++++++++++

In addition to setting up a player, the JW Player embed script contains a function to unload a player. It's very simple:

.. code-block:: html

    jwplayer("container").remove();

This formal **remove()** function will make sure the player stops its streams, the DOM is re-set to its original state and all event listeners are cleaned up.

Flash Window Mode (wmode) Configuration
+++++++++++++++++++++++++++++++++++++++

The JW Player embed script allows publishers to configure the window mode of Flash through the **wmode** configuration parameter. It may be set to any of the `allowed values <http://kb2.adobe.com/cps/127/tn_12701.html>`_  (**window**, **opaque**, or **transparent**). The default window mode used by the embed script is **opaque** as this provides the best performance. 

.. code-block:: html
    
    <div id="container">Loading the player ...</div>
    
    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/player.swf",
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            wmode: "opaque"
        });
    </script>