.. _options:

Configuration Options
=====================

Here's a list of all configuration options (flashvars) the player accepts. Options are entered in the :ref:`embed code <embed>` to set how the player looks and functions.

Encoding
--------

First, a note on encoding. You must URL encode the three glyphs **?** **=** **&** inside flashvars, because of the way these flashvars are loaded into the player (as a querystring). The urlencoded values for these symbols are listed here:

 * ? → %3F
 * = → %3D
 * & → %26

If, for example, your **file** flashvar is at the location *getplaylist.php?id=123&type=flv*, you must encode the option to:

.. code-block:: html

   getplaylist.php%3Fid%3D123%26type%3Dflv

The player will automatically URLdecode every option it receives.


File properties
---------------

These options set different properties of the mediafile to load (e.g. the source file, preview image or video title). Each of these option can be set for every entry in a :ref:`playlist <playlists>`.

.. describe:: duration ( 0 )

   Duration of the file in seconds. Set this to present the duration in the controlbar before the video starts. It can also be set to a shorter value than the actual file duration. The player will restrict playback to only that section.

.. describe:: file ( undefined )

   Location of the file or playlist to play, e.g. *http://www.mywebsite.com/myvideo.mp4*.

.. describe:: image ( undefined )

   Location of a preview (poster) image; shown in display before the video starts.

.. describe:: link ( undefined )

   URL to an external page the display can link to (see *displayclick* below). Sharing - related plugins also use this link.

.. describe:: start ( 0 )

   Position in seconds where playback should start. This option works for :ref:`http`, :ref:`rtmp` and the MP3 and Youtube :ref:`files <media>`. It does not work for regular videos.

.. describe:: streamer ( undefined )

   Location of an RTMP or HTTP server instance to use for streaming. Can be an RTMP application or external PHP/ASP file. See :ref:`rtmp` and :ref:`http`.

.. describe:: type ( undefined )

   Set this flashvar to tell the player in which format (regular/streaming) the player is. By default, the type is detected by the player based upon the file extension. If there is no suiteable extension, it can be manually set. The following media types are supported:

   * **video**: progressively downloaded FLV / MP4 video, but also AAC audio. See :ref:`media`.
   * **sound**: progressively downloaded MP3 files. See :ref:`media`.
   * **image**: JPG/GIF/PNG images. See :ref:`media`.
   * **youtube**: videos from Youtube. See :ref:`media`.
   * **http**: FLV/MP4 videos using HTTP pseudo-streaming. See :ref:`http`.
   * **rtmp**: FLV/MP4/MP3 files or live streams using RTMP streaming. See :ref:`rtmp`.


Appearance
----------

These flashvars control the looks of the player. 

.. describe:: backcolor ( ffffff )

   background color of the controlbar and playlist. This is white  by default.

.. describe:: controlbar ( bottom )

   Position of the controlbar. Can be set to *bottom*, *over* and *none*.

.. describe:: frontcolor ( 000000 )

   color of all icons and texts in the controlbar and playlist. Is black by default.

.. describe:: lightcolor ( 000000 )

   Color of an icon or text when you rollover it with the mouse. Is black by default.

.. describe:: logo ( undefined )

   Location of an external JPG, PNG or GIF image to show in a corner of the display. With the default skin, this is top-right, but every skin can freely place the logo.

.. describe:: playlist ( none )

   Position of the playlist. Can be set to **bottom**, **right**, **left**, **over** or **none**.

.. describe:: playlistsize ( 180 )

   When the playlist is positioned below the display, this option can be used to change its height. When the playlist lives left or right of the display, this option represents its width. In the other cases, this option isn't needed.

.. describe:: screencolor ( 000000 )

   Background color of the display. Is black by default.

.. describe:: skin ( undefined )

   Location of a so-called **skin**, an SWF file with the player graphics. Our `addons repository <http://www.longtailvideo.com/addons/skins>`_ contains a list of available skins.

The color flashvars need so-called hexadecimal values, as is common for `web colors <http://en.wikipedia.org/wiki/Web_colours>`_ (e.g. ''FFCC00'' for bright yellow).



Behaviour
---------

These flashvars control the playback behaviour of the player. 

.. describe:: autostart ( false )

   Set this to *true* to automatically start the player on load.

.. describe:: bufferlength ( 1 )

   Number of seconds of the file that has to be loaded before the player starts playback. Set this to a low value to enable instant-start (good for fast connections) and to a high value to get less mid-stream buffering (good for slow connections).

.. describe:: displayclick ( play )

   What to do when a user clicks the display. Can be:

   * **play**: toggle playback
   * **link**: jump to the URL set by the *link* flashvar. 
   * **none**: do nothing (the handcursor is also not shown).

.. describe:: dock ( false )

   set this to **true** to list plugin buttons in display. By default (*false*), plugin buttons are shown in the controlbar.

.. describe:: linktarget ( _blank )

   Browserframe where link from the display are opened in. Some possibilities are *_self* (same frame) or *_blank* (new browserwindow).

.. describe:: mute ( false )

   Mute the sounds on startup. Is saved in a cookie.

.. describe:: plugins ( undefined )

   A powerful feature, this is a comma-separated list of plugins to load (e.g. **hd,viral**). Plugins are separate SWF files that extend the functionality of the player, e.g. with advertising, analytics or viral sharing features. Visit `our addons repository <http://www.longtailvideo.com/addons/plugins>`_ to browse the available plugins.

.. describe:: repeat ( none )

   What to do when the mediafile has ended. Has several options:

   * **none**: do nothing (stop playback) whever a file is completed.
   * **list**: play each file in the playlist once, stop at the end.
   * **always**: continously play the file (or all files in the playlist).
   * **single**: continously repeat the current file in the playlist.

.. describe:: shuffle ( false )

   Shuffle playback of playlist items. The player will randomly pick the items.

.. describe:: smoothing ( true )

   This sets the smoothing of videos, so you won't see blocks when a video is upscaled. Set this to **false** to disable the feature and get performance improvements with old computers / big files.

.. describe:: stretching ( uniform )

   Defines how to resize the poster image and video to fit the display. Can be:

   * **none**: keep the original dimensions.
   * **exactfit**: disproportionally stretch the video/image to exactly fit the display.
   * **uniform**: stretch the image/video while maintaining its aspect ratio. There'll be black borders.
   * **fill**: stretch the image/video while maintaining its aspect ratio, completely filling the display.


Config XML
----------

All options can be listed in an XML file and then fed to the player with a single option:

.. describe:: config ( undefined )

   location of a XML file with flashvars. Useful if you want to keep the actual embed codes short. Here's an example:

Here is an example of such an XML file:

.. code-block:: xml

   <config>
     <file>files/bunny.mp4</file>
     <image>files/bunny.jpg</image>
     <repeat>true</repeat>
     <backcolor>333333</backcolor>
     <volume>40</volume>
     <controlbar>over</controlbar>
   </config>

Options set in the embed code will overwrite those set in the config XML.

.. note:: 

   Due to the :ref:`crossdomain` restrictions of Flash, you cannot load a config XML from one domain in a player on another domain. This issue can be circumvented by placing a *crossdomain.xml* file on the server that hosts your XML.