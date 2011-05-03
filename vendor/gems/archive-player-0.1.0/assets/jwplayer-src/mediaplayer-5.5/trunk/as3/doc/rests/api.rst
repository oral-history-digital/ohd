.. _api:

API Reference
=============

The JW Player for Flash supports a flexible javascript API. It is possible to read the config/playlist variables of the player, send events to the player (e.g. to pause or load a new video) and listen (and respond) to player events. A small initialization routine is needed to connect your apps to the player.


Initialization
--------------
 
Please note that the player will **NOT** be available the instant your HML page is loaded and the first javascript is executed. The SWF file (40k) has to be loaded and instantiated first! You can catch this issue by defining a simple global javascript function. It is called *playerReady()* and every player that's succesfully instantiated will call it. 

.. code-block:: html

   var player;
   function playerReady(*object*) {
     alert('the player is ready');
     player = document.getElementById(object.id);
   };


The *object* the player send to the function contain the following variables:

.. describe:: id

   ID of the player (the *<embed>* code) in the HTML DOM. Use it to get a reference to the player with *getElementById()*.

.. describe:: version

   Exact version of the player in MAJOR.MINOR.REVISION format *e.g. 4.7.1017*.

.. describe:: client

  Plugin version and platform the player uses, e.g. *FLASH WIN 10.0.47.0*.

If you are not interested in calling the player when the page is loading, you won't need the *playerReady()* function. You can then simply use the ID of the embed/object tag that embeds the player to get a reference. So for example with this embed tag:

.. code-block:: html

   <embed id="myplayer" name="myplayer" src="/upload/player.swf" width="400" height="200" />

You can get a pointer to the player with this line of code:

.. code-block:: html

   var player = document.getElementById('myplayer');

.. note:: 

   Note you must add both the **id** and **name** attributes in the *<embed>* in order to get back an ID in all browsers.


Reading variables
-----------------

There's two variable calls you can make through the API: *getConfig()* and *getPlaylist()*.

getConfig()
^^^^^^^^^^^

getConfig() returns an object with state variables of the player. For example, here we request the current audio volume, the current player width and the current playback state:

.. code-block:: html

   var volume = player.getConfig().volume;
   var width = player.getConfig().width;
   var state = player.getConfig().state;

Here's the full list of state variables:

.. describe:: bandwidth

   Current bandwidth of the player to the server, in kbps (e.g. *1431*). This is only available for videos, :ref:`http` and :ref:`rtmp`.

.. describe:: fullscreen

   Current fullscreen state of the player, as boolean (e.g. *false*).

.. describe:: height

   Current height of the player, in pixels (e.g. *270*).

.. describe:: item

   Currently active (playing, paused) playlist item, as zero-index (e.g. *0*). Note that *0* means the first playlistitem is playing and *1* means the second one is playing.

.. describe:: level

   Currently active bitrate level, in case multipe bitrates are supplied to the player. This is only useful for  :ref:`http` and :ref:`rtmp`. Note that *0* always refers to the highest quality bitrate.

.. describe:: position

   current playback position, in seconds (e.g. *13.2*).

.. describe:: state

   Current playback state of the player, as an uppercase string. It can be one of the following:

   * *IDLE*: The current playlist item is not loading and not playing.
   * *BUFFERING*: the current playlistitem is loading. When sufficient data has loaded, it will automatically start playing.
   * *PLAYING*: the current playlist item is playing.
   * *PAUSED*: playback of the current playlistitem is not paused by the player.
   * *COMPLETED*: the current playlist item has completed playback. This state differs from the *IDLE* state in that the item is now already loaded.

.. describe:: mute

   Current audio mute state of the player, as boolean (e.g. *false*). 

.. describe:: volume

   Current audio volume of the player, as a number from 0 to 100 (e.g. *90*). 

.. describe:: width

   Current width of the player, in pixels (e.g. *480*).

.. Note:: 

   In fact, all the :ref:`options` will be available in the response to *getConfig()*. In certain edge cases, this might be useful, e.g. when you want to know if the player did **autostart** or not.


getPlaylist()
^^^^^^^^^^^^^

getPlaylist() returns the current playlist of the player as an array. Each entry of this array is in turn again a hashmap with all the :ref:`playlist properties <playlists>` the player recognizes. Here's a few examples:

.. code-block:: html

   var playlist = player.getPlaylist();
   alert("There are " + playlist.length + " videos in the playlist");
   alert("The title of the first entry is " + playlist[0].title);
   alert("The poster image of the second entry is " + playlist[1].image);
   alert("The media file of the third entry is " + playlist[2].file);
   alert("The media type of the fourth entry is " + playlist[3].type);


Sending events
--------------

The player can be controlled from javascript by sending events (e.g. to pause it or change the volume). Sending events to the player is done through the *sendEvent()* call. Some of the event need a parameter and some don't. Here's a few examples:

.. code-block:: html

   // this will toggle playback.
   player.sendEvent("play");
   // this sets the volume to 90%
   player.sendEvent("volume","true");
   // This loads a new video in the player
   player.sendEvent('load','http://content.bitsontherun.com/videos/nPripu9l-60830.mp4');

Here's the full list of events you can send, plus their parameters:


.. describe:: item ( index:Number )

   Start playback of a specific item in the playlist. If *index* isn't set, the current playlistitem will start.

.. describe:: link ( index:Number )

   Navigate to the *link* of a specific item in the playlist. If *index* is not set, the player will navigate to the link of the current playlistitem.

.. describe:: load ( url:String )

   Load a new media file or playlist into the player. The *url* must always be sent.
   
   .. note:: Instead of a URL, it is also possible to send a full playlist object along with this call. For more info, see *Loading playlists* below.

.. describe:: mute ( state:Boolean )

   Mute or unmute the player's sound. If the *state* is not set, muting will be toggled.

.. describe:: next

   Jump to the next entry in the playlist.  No parameters.

.. describe:: play ( state:Boolean )

   Play (set *state* to *true*) or pause (set *state* to *false*) playback. If the *state* is not set, the player will toggle playback.

.. describe:: prev

   Jump to the previous entry in the playlist.  No parameters.

.. describe:: seek ( position:Number )

   Seek to a certain position in the currently playing media file. The *position* must be in seconds (e.g. *65* for one minute and five seconds). 

   .. note::

      Seeking does not work if the player is in the *IDLE* state. Make sure to check the *state* variable before attempting to seek. 

      Additionally, for the *video* media type, the player can only seek to portions of the video that are already loaded. All other media types (*sound*, *image*, *youtube*, *http* and *rtmp* streaming) do not have this additional restriction.

.. describe:: stop

   Stop playback of the current playlist entry and unload it. The player will revert to the *IDLE* state and the poster image will be shown. No parameters.

.. describe:: volume ( percentage:Number )

   Change the audio volume of the player to a certain percentage (e.g. *90*). If the player is muted, it will automatically be unmuted when a volume event is sent.

.. note:: 

   Due to anti-phishing restrictions in the Adobe Flash runtime, it is not possible to enable/disable fullscreen playback of the player from javascript.


Loading playlists
^^^^^^^^^^^^^^^^^

The ***load*** event is mostly used for loading a single video or a single playlist into the player. This is done setting the second parameter of the event to the URL of the video:

.. code-block:: html

   player.sendEvent("load","http://www.mysite.com/video.mp4");

The player will inspect the URL, decide which :ref:`media format <media>` or :ref:`playlist format <playlists>` it is and setup its internal playlist accordingly.

It is also possible to load an already preformatted playlist in the player using this same **load** call. This is useful in situations where e.g. you want to create or manipulate the playlist in javascript.

The preformatted playlist should be an *array* that contains one or more *object* blocks. Each *object* block in turn contains multiple :ref:`playlistitem properties <playlists>` as key:value pairs. Here are two examples of playlist loading; one with a single entry and one with multiple entries:

.. code-block:: javascript

   // Here we load a single-entry playlist. 
   // We set the video to RTMP streaming, plus we set the start position.
   var list1 = new Array(
       { file:"video.mp4", type:"rtmp", start: 56, streamer: "rtmp://mysite.com/definst" }
   );
   player.sendEvent("load",list1);
   
   // Here we load a full playlist. 
   // For each entry, we set a title.
   var list2 = new Array(
       { file:"/static/bbb.mp4", type:"video", title: "Big Buck Bunny Trailer" },
       { file:"/static/ed.mp3", type:"sound", title: "Elephant's Dream Podcast" },
       { file:"/static/sintel.jpg", type:"image", title: "Sintel Movie Poster" }
   );
   player.sendEvent("load",list2);

.. note::

   Both the **file** and the **type** properties are required for each playlistitem. If one of the two is missing, the playlistitem will not be loaded. The **type** property can be *video*, *sound*, *image*, *youtube*, *http* and *rtmp*.


Setting listeners
-----------------

In order to let javascript respond to player updates, you can assign listener functions to various events the player fires. An example of such event is the *volume* one, when the volume of the player is changed. The player will call the listener function with one parameter, a *key:value* populated object that contains more info about the event.

Both the *Model* and the *Controller* of the player's :ref:`MVC structure <architecture>` send events. You can subscribe to their events by resp. using the *addModelListener()* and *addControllerListener()* function. Here's a few examples:

.. code-block:: html

   function stateTracker(obj) { 
      alert('the playback state is changed from '+obj.oldstate+' to '+obj.newstate);
   };
   player.addModelListener("state","stateTracker");

   function volumeTracker(obj) {
      alert('the audio volume is changed to: '+obj.percentage'+ percent');
   };
   player.addControllerListener("volume","volumeTracker");

If you only need to listen to a certain event for a limited amount of time (or just once), use the *removeModelListener()* and removeControllerListener()* functions to unsubscribe your listener function. The syntax is exactly the same:

.. code-block:: html

   player.removeModelListener("state","stateTracker");
   player.removeControllerListener("volume","volumeTracker");

.. note:: 

   You MUST string representations of a function for the function parameter!

Model events
^^^^^^^^^^^^

Here's an overview of all events the *Model* sends. Note that the data of every event contains the *id*, *version* and *client* parameters that are also sent on :ref:`playerReady() <api>`.

.. describe:: error

   Fired when a playback error occurs (e.g. when the video is not found or the stream is dropped). Data:

   * *message* ( String ): the error message, e.g. *file not found*  or *no suiteable playback codec found*.

.. describe:: loaded

   Fired while the player is busy loading the currently playing media item. This event is never sent for :ref:`rtmp`, since that protocol does not preload content. Data:

   * *loaded* ( Number ): the number of bytes of the media file that are currently loaded.
   * *total* ( Number ): the total filesize of the media file, in bytes.
   * *offset* (Number): the byte position of the media file at which loading started. This is always 0, except when using :ref:`http`.

.. describe:: meta

   Fired when metadata on the currently playing media file is received. The exact metadata that is sent with this event varies per individual media file. Here are some examples:

   * *duration* ( Number) : sent for *video*, *youtube*, *http* and *rtmp* media. In seconds.
   * *height* ( Number ): sent for all media types, except for *youtube*. In pixels.
   * *width* ( Number ): sent for all media types, except for *youtube*. In pixels.
   * Codecs, framerate, seekpoints, channels: sent for *video*, *http* and *rtmp* media.
   * TimedText, captions, cuepoints: additional metadata that is embedded at a certain position in the media file. Sent for *video*, *http* and *rtmp* media.
   * ID3 info (genre, name, artist, track, year, comment): sent for MP3 files (the *sound* media type).


   .. note:: 

      Due to the :ref:`crossdomain` restrictions of Flash, you cannot load a ID3 data from an MP3 on one domain in a player on another domain. This issue can be circumvented by placing a *crossdomain.xml* file on the server that hosts your MP3s.

.. describe:: state

   Fired when the playback state of the video changes. Data:

   * *oldstate* ( 'IDLE','BUFFERING','PLAYING','PAUSED','COMPLETED' ): the previous playback state.
   * *newstate* ( 'IDLE','BUFFERING','PLAYING','PAUSED','COMPLETED' ): the new playback state. 

.. describe:: time

   Fired when the playback position is changing (i.e. the media file is playing). It is fired with a resolution of 1/10 second, so there'll be a lot of events! Data:

   * *duration* ( Number ): total duration of the media file in seconds, e.g. *150* for two and a half minutes.
   * *position* ( Number ): current playback position in the file, in seconds.

Controller events
^^^^^^^^^^^^^^^^^

Here's an overview of all events the *Controller* sends. Note that the data of every event contains the *id*, *version* and *client* parameters that are also sent on :ref:`playerReady() <api>`.

.. describe:: item

   Fired when the player switches to a new playlist entry. The new item will immediately start playing. Data:

  * *index* ( Number ): playlist index of the media file that starts playing.

.. describe:: mute

   Fired when the player's audio is muted or unmuted. Data:

   * *state* ( Boolean ): the new mute state. If *true*, the player is muted.
 
.. describe:: play

   Fired when the player toggles playback (playing/paused). Data:

   * *state* ( Boolean ): the new playback state. If *true*, the player plays. If *false*, the player pauses.

.. describe:: playlist

   Fired when a new playlist (a single file is also pushed as a playlist!) has been loaded into the player. Data:

   * *playlist* ( Array ): The new playlist. It has exactly the same structure as the return of the *getPlaylist()* call.

.. describe:: resize

   Fired when the player is resized. This includes entering/leaving fullscreen mode. Data:

   * *fullscreen* ( Boolean ): The new fullscreen state. If *true*, the player is in fullscreen.
   * *height* ( Number ): The overall height of the player.
   * *width* ( Number ): The overall width of the player.

.. describe:: seek

   Fired when the player is seeking to a new position in the video/sound/image. Parameters:

   * *position* ( Number ): the new position in the file, in seconds (e.g. *150* for two and a half minute).

.. describe:: stop

   Fired when the player stops loading and playing. The playback state will turn to *IDLE* and the position of a video will be set to 0. No data.

.. describe:: volume

   Fired when the volume level is changed. Data:

   * *percentage* ( Number ): new volume percentage, from 0 to 100 (e.g. *90*).
