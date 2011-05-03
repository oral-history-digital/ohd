.. _api:

Player API
==========

The HTML5 player contains a simple javascript API which can be used to:

* Request the various playback states (*time*, *volume*, *dimensions*).
* Control the player through a number of available methods (*play*, *pause*, *load*).
* Track the player state by listening to certain events (*time*, *volume*, *resize*).

Since the HML5 player is built using the jQuery, its API is using several conventions found in this framework.

Referencing a player
--------------------

Before you can interact with the player, you need to be able to reference it (get a hold of it) from your javascript code. If you use a single player on the page, this is very simple: 

.. code-block:: html

   <video width="400" height="300" src="/static/video.mp4"></video>
   
   <script type="text/javascript">
     var player = $.jwplayer();
     player.play();
   </script>

If you have multiple players on a page, you can reference a single player by giving each player a specific ID. Next, you use a `jQuery selector <http://api.jquery.com/category/selectors/>`_ to get to the player you want:

.. code-block:: html

   <video id="player1" width="400" height="300" src="../video1.mp4"></video>
   <video id="player2" width="400" height="300" src="../video2.mp4"></video>

   <script type="text/javascript">
     var player = $.jwplayer("#player1");
     player.play();
   </script>


Requesting properties
---------------------

The player contains a number of properties (such as its *volume* or playback *state*) that can be requested at runtime. Here's how to request a player property:

.. code-block:: html

   <video width="400" height="300" src="/static/video.mp4"></video>

   <p onclick="alert($.jwplayer().volume())">Get player volume</p>

Here's the full list of available properties:

.. describe:: buffer ()

   The percentage of the videofile that is downloaded to the page. Can be **0** to **100**.

.. describe:: duration ()

   The duration of the video file, in seconds. This will not be available on startup, but as of the moment the metadata of a video is loaded. 

.. describe:: fullscreen ()

   The fullscreen state of the player. Can be **true** or **false**.

   .. note:: Current browsers do not support true fullscreen, like Flash or Silverlight do. The fullscreen mode of the HTML5 player will rather be a full-browser-screen.

.. describe:: height ()

   The height of the player, in pixels.


.. describe:: mute ()

   The sound muting state of the player. Can be **true** (no sound) or **false**.

   .. note:: *Volume* and *mute* are separate properties. This allows the player to switch to the previously used volume when the player is muted and then unmuted.


.. describe:: state ()

   The current playback state of the player. Can be:

   * **idle**: Video not playing, video not loaded.
   * **buffering**: Video is loading, the player is waiting for enough data to start playback.
   * **playing**: Video is playing.
   * **paused** Video has enough data for playback, but the user has paused the video. 

.. describe:: time ()

   The current playback position of the video, in seconds.

.. describe:: volume ()

   The audio volume percentage of the player, can be **0** to **100**.

.. describe:: width ()

   The width of the player, in pixels.


Calling methods
---------------

The player exposes a list of methods you can use to control it from javascript (e.g. *play*).  Here's how to invoke a player method:

.. code-block:: html

   <video width="400" height="300" src="/static/video.mp4"></video>
   
   <ul>
     <li> onclick="$.jwplayer().play()">play the video</li>
     <li> onclick="$.jwplayer().pause()">pause the video</li>
     <li> onclick="$.jwplayer().seek(0)">play from the beginning of the video</li>
   </ul>

Here's the full list of available methods for the player:


.. describe:: fullscreen (state) 

   Change fullscreen playback. The state can be **true** or **false**.

   .. note:: Current browsers do not support true fullscreen, like Flash or Silverlight do. The fullscreen mode of the HTML5 player will rather be a full-browser-screen.

.. describe:: load (url)

   Load a new video into the player. The **url** should be a valid hyperlink to the video file (e.g. **/static/video/holiday.mp4**). The file can be in any :ref:`supported media type <formats>`.

.. describe:: mute (state)

   Change the mute state of the player. The *state* can be **true** or **false**. 

.. describe:: pause ()

   Pause playback of the video. If the video is already *paused* (or *idle*), this method does nothing.

.. describe:: play ()

   Start playback of the video. If the video is already *playing* (or *buffering*), this method does nothing.

.. describe:: resize (width,height)

   Resize the player to a certain **width** and **height** (in pixels). Use this to e.g. toggle between a small and large  player view like Youtube does.

.. describe:: seek (position)

   Seek to and playing the video from a certain *position*, in seconds (e.g. **120** for 2 minutes in). If the player is *paused* or *idle*, it will start playback.

.. describe:: stop ()

   Stop playing the video, unload the video and display the poster frame. The player proceeds to the **idle** state.

.. describe:: volume (volume)

   Set the player audio volume percentage, a number between 0 and 100. When changing the volume while the player is muted, it will also automatically be unmuted.


Listening to events
-------------------

The player broadcasts an event whenever one of its properties change (e.g. the playback *time*, *fullscreen* state or *volume*). Listen to these events to build interaction between the player and other elements on the page (e.g. showing a message when the video starts). Here's how to listen to an event:

.. code-block:: html

   <video width="400" height="300" src="/static/video.mp4"></video>

   <p id="message"></p>

   <script type="text/javascript"> 
     function stateListener(event) {
       $('#message').html('The new playback state is '+event.state);
     };
     $.jwplayer.addEventListener('jwplayerPlayerState',stateListener);
   </script>

Here's the full list of events, and their parameters:

.. describe:: 'jwplayerMediaBuffer'

   This event is fired while the video to play is being downloaded. Parameters:

   * **buffer** (*number*): percentage of the video that is downloaded (0 to 100).
   * **player** (*jwplayer*): Reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerMediaComplete'

   The end of the video was reached during playback. Parameters:

   * **player** (*jwplayer*): Reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerMediaError'

   There was an error loading or playing the video (e.g. the video was not found). Parameters:

   * **message** (*string*): The error message.
   * **player** (*jwplayer*): Reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerFullscreen'

   The player has switched from / to fullscreen mode. Parameters:

   * **fullscreen** (*boolean*): The new fullscreen state (if *true*, the player is in fullscreen).
   * **player** (*jwplayer*): Reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerMediaLoaded'

   A new video is loaded into the player. Note that the actual video date is not loaded yet (you should listen to the *jwplayerMediaBuffer* event for that). This event states the loaded file is ready for playback. Parameters:

   * **player** (*jwplayer*): Reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerMediaMeta'

   The player has received metadata about the video it is playing. Parameters:

   * **data** (*object*): an object with key:value pairs of metadata (e.g. duration, height and width).
   * **player** (*jwplayer*): reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerMediaMute'

   The mute state of the player just got updated. When muted, the audio is completely dropped. The player will display a muted icon on top of the video. Parameters:

   * **mute** (*boolean*): the new mute state (if *true*, the player is silent).
   * **player** (*jwplayer*): reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerResize'

   The player was resized on the page to different dimensions. Parameters:

   * **height** (*number*): the new height of the player, in pixels.
   * **width** (*number*): the new width of the player, in pixels.
   * **player** (*jwplayer*): reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerPlayerState'

   The playback state of player was changed. Parameters:

   * **oldstate** (*idle* ,*buffering* ,*paused* ,*playing*): The playback state the player just switched away from. Can be one of 4 states
   * **newstate** (*idle* ,*buffering* ,*paused* ,*playing*): The playback state the player just switched to. Can be one of 4 states
   * **player** (*jwplayer*): reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerMediaTime'

   The position and/or duration of the mediafile have changed. This event typically fires when the mediafile is playing, with a resolution of 10x / second. Parameters:

   * **position** (*number*): current playback position in the mediafile, in seconds.
   * **duration** (*number*): total duration of the mediafile, in seconds.
   * **player** (*jwplayer*): reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.

.. describe:: 'jwplayerMediaVolume'

   The audio volume of the player just got updated. Parameters:

   * **volume** (*number*): the new volume percentage (0 to 100).
   * **player** (*jwplayer*): reference to the player that sent the event.
   * **version** (*string*): version of the JW Player, e.g. 1.0.877.
