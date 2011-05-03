.. _options:

Configuration options
=====================

The options of the HTML5 player are what the *flashvars* are for the Flash player: configuration settings for tweaking its layout and behaviour.

Most of these options correspond to certain attributes of the *<video>* tag. Whenever the JW Player is applied to a tag, the options of this tag will automatically be loaded into the player.

Inserting options
-----------------

Options can be added to the player by inserting them into a player instantiation code. For example, here we add the *skin* and *autostart* options:

.. code-block:: html

   $('video').jwplayer({
     skin:'/player/skins/five/five.xml',
     autostart:false
   });

See :ref:`embed` for more embedding options. Note that the default embedding option (tagging everything with a **jwplayer** class) does not allow you to set specific player options.


Media options
-------------

.. describe:: duration (0):

   Duration of the video, in seconds. This can be set to the actual duration of the video, purely to make the controlbar reflect the video duration before it starts playing.

.. describe:: file (undefined): 

   The video file to play. See :ref:`formats` for a list of supported file formats in the various browsers.
    
   .. note:: If the player is applied to a *<video>* tag, its **src** attribute is the default value of this option. If the player is applied to a *<video>* tag with multiple *<source>* tags, the first source that can be played back is used.

.. describe:: image (undefined): 

   The poster image to display before the video starts and after it ends. Can be any JPG, GIF or PNG image.

   .. note:: If the player is applied to a *<video>* tag, its poster attribute is the default value of this option.


Layout options
--------------

For modifying the layout of the player, the following options are available:

.. describe:: controlbar ('bottom'):
 
   Position of the controlbar related to the player. Can be bottom, none or over. 

   .. note:: If the player is applied to a *<video>* tag, its controls attribute is the default value of this option (with bottom corresponding to true).

.. describe:: height (295): 

   Height of the player in pixels. Can be a number between 10 and 9999. 

   .. note:: If the player is applied to a *<video>* tag, its **height** attribute is the default value of this option.

.. describe:: skin ('assets/five/five.xml'): 

   PNG Skin to load. PNG skins are fully supported by both the HTML5 and the Flash player.

   .. note:: 

      The JW Player for HTML5 is fully compatible with the `PNG Skinning model <http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v5/14/skinning-the-jw-player-5>`_ of the JW Player for Flash. Any PNG skin built for the Flash player can be used in the HTML5 player. You do need to unzip a skin before it can be loaded into the HTML5 player. Zipped skins are not supported (yet).

.. describe:: screencolor ('000000'): 

   Background color of the video display. Can be any hexadecimal color value.

.. describe:: stretching ('uniform'): 

   Stretching mode of the video to the display. Can be:

   * *uniform*: scale the video proportionally so that it fits to the display. 
   * *fill*: scale the video proportionally to entirely fill the display.
   * *exactfit*: scale the video disproportionally to exactly fit the display.
   * *none*: show the video in its original dimensions.

.. describe:: width (480): 

   Width of the player in pixels. Can be a number between 10 and 9999. 

   .. note:: If the player is applied to a *<video>* tag, its **width** attribute is the default value of this option.



Behaviour options
-----------------

For modifying the behaviour of the player, the following options are available:

.. describe:: autostart (false):

   Set this to **true** to automatically start the player on page load.

   .. note:: If the player is applied to a *<video>* tag, its **autoplay** attribute is the default value.

.. describe:: debug (false): 

   Set this to **true** to let the player fire all its events to *console.log()*. This can be read e.g. by Firebug or the Safari error console.

.. describe:: flashplayer ('assets/player.swf'): 

   Location of the JW Player for Flash that is used for fallback in browsers that do not support HTML5. When set to **false**, the flashplayer fallback is not used.


.. describe:: mute ('false'): 

   Set this to **true** to mute the video on page load.

.. describe:: repeat (false): 

   Set this to **true** to continously repeat playback.

   .. note:: If the player is applied to a *<video>* tag, its **loop** attribute is the default value.

.. describe:: volume (90): 

   Startup volume of the video, can be **0** to **100**.
