.. _api:

Player API
==========

The 5.3 player introduces a new, shorthand javascript API for interacting with your website. This API abstracts any differences between Flash and HTML5; any code you write will work with both technologies.



Getting started
---------------

To get a sense of the possibilities, here's a quick example that showcases how to control the player from the page:

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
    
    <ul>
        <li onclick="jwplayer().play()">Start the player</li>
        <li onclick="alert(jwplayer().getPosition())">Get current position</li>
    </ul>

Of course it's also possible to have the player manipulate the page. Here's a second example, using the  :ref:`event block <embed_events>` of the JW Player embedder:

.. code-block:: html
    
    <div id="container">Loading the player ...</div>
    
    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            events: {
                onComplete: function() { 
                    document.getElementById("status").innerHTML("That's all folks!"); 
                }
            }
        });
    </script>
    
    <p id="status"></p>

The following sections give a detailed description of the JW Player API, describing how to:

* Select a player.
* Get variables from a player.
* Call functions on a player.
* Listen to events from a player.



Selecting
---------

The first thing you need to do when attempting to interact with a JW Player, is to get a reference to it. The easiest way, probably sufficient for 95% of all use cases is this:

.. code-block:: javascript

    // Start the player on this page
    jwplayer().play();


Only when you have multiple players on a page, you need to be more specific on which player you want to interact with. In that case, there are three ways to select a player:

* With the *id* of the element you :ref:`instantiated <embed>` the player over:
    
    .. code-block:: javascript
    
        jwplayer("container").play();

* With the actual DOM element itself:
    
    .. code-block:: javascript
    
        var element = document.getElementById("container");
        jwplayer(element).play();

* With the index in the list of players on the page (in order of loading):
   
    .. code-block:: javascript
      
        jwplayer(2).play();
    
    .. note::
    
        The selector *jwplayer(0)* is actually the same as *jwplayer()*.



Variables
---------

Here is a list of all the variables that can be retrieved from the player:

.. describe:: getBuffer()

    Returns the current PlaylistItem's filled buffer, as a **percentage** (0 to 100) of the total video's length.
    
.. describe:: getFullscreen()

    Returns the player's current **fullscreen** state, as a boolean (*true* when fullscreen).

.. describe:: getMeta()

    Returns the current PlaylistItem's **metadata**, as a javascript object. This object contains arbitrary key:value parameters, depending upon the type of player, media file and streaming provider that is used. Common metadata keys are *width*, *duration* or *videoframerate*.

.. describe:: getMute()

    Returns the player's current audio muting state, as a boolean (*true* when there's no sound).

.. describe:: getPlaylist()

    Returns the player's entire **playlist**, as an array of PlaylistItem objects. Here's an example playlist, with three items:
    
    .. code-block:: javascript
    
        [
            { duration: 32, file: "/uploads/video.mp4", image: "/uploads/video.jpg" },
            { title: "cool video", file: "/uploads/bbb.mp4" },
            { duration: 542, file: "/uploads/ed.mp4", start: 129 }
        ]

.. describe:: getPlaylistItem(*index*):

    Returns the playlist **item** at the specified *index*. If the *index* is not specified, the currently playing playlistItem is returned. The **item**  that is returned is an object with key:value properties (e.g. *file*, *duration* and *title*). Example:
    
    .. code-block:: javascript
    
        { duration: 32, file: "/uploads/video.mp4", image: "/uploads/video.jpg" }

.. describe:: getWidth()

    Returns the player's current **width**, in pixels.

.. describe:: getHeight()

    Returns the player's current **height**, in pixels.

.. describe:: getState()

    Returns the player's current playback state. It can have the following values:
    
    * **BUFFERING**: user pressed *play*, but sufficient data has to be loaded first (no movement).
    * **PLAYING**: the video is playing (movement). 
    * **PAUSED**: user paused the video (no movement).
    * **IDLE**: either the user stopped the video or the video has ended (no movement).

.. describe:: getPosition()

    Returns the current playback **position** in seconds, as a number.

.. describe:: getDuration()

    Returns the currently playing PlaylistItem's duration in seconds, as a number.

.. describe:: getVolume()

    Returns the current playback volume percentage, as a number (0 to 100).



Functions
---------

Here is a list of all functions that can be called on the player:

.. describe:: setFullscreen(state)

    Change the player's fullscreen mode. Parameters:
    
    * **state**:Boolean (*undefined*): If state is undefined, perform a fullscreen toggle. Otherwise, set the player's fullscreen mode to fullscreen if true, and return to normal screen mode if false.

.. describe:: setMute(state)

    Change the player's mute state (no sound). Parameters:

    * **state**:Boolean (undefined): If *state* is undefined, perform a muting toggle. Otherwise, mute the player if true, and unmute if false.

.. describe:: load(playlist)

    Loads a new playlist into the player. The **playlist** parameter is required and can take a number of forms:
    
    * *Array*: If an array of PlaylistItem objects is passed, load an entire playlist into the player. Example:
    
        .. code-block:: javascript
        
            [
                { duration: 32, file: "/uploads/video.mp4", image: "/uploads/video.jpg" },
                { title: "cool video", file: "/uploads/bbb.mp4" },
                { duration: 542, file: "/uploads/ed.mp4", start: 129 }
            ]

    * *Object*: If a PlaylistItem is passed, load it as a single item into the player. Example:
    
        .. code-block:: javascript
        
            { duration: 32, file: "/uploads/video.mp4", image: "/uploads/video.jpg" },
        
    * *String*: Can be an XML playlist, or the link to a single media item (e.g. an MP4 video).

.. describe:: playlistItem(index)

    Jumps to the playlist item at the specified index. Parameters:
    
    * **index**:Number: zero-based index into the playlist array (i.e. playlistItem(0) jumps to the first item in the playlist).

.. describe:: playlistNext()

    Jumps to the next playlist item. If the current playlist item is the last one, the player jumps to the first.

.. describe:: playlistPrev()

    Jumps to the previous playlist item. If the current playlist item is the first one, the player jumps to the last.

.. describe:: resize(width, height)

    Resizes the player to the specified dimensions. Parameters:
    
    * **width**:Number: the new overall width of the player.
    * **height**:Number: the new overall height of the player.
    
    .. note::
    
        If a controlbar or playlist is displayed next to the video, the actual video is of course smaller than the overall player.

.. describe:: play(state)

    Toggles playback of the player. Parameters:
    
    * **state**:Boolean (undefined): if set *true* the player will start playing. If set *false* the player will pause. If not set, the player will toggle playback.


.. describe:: pause(state)

    Toggles playback of the player. Parameters:
    
    * **state**:Boolean (undefined): if set *true* the player will pause playback. If set *false* the player will play. If not set, the player will toggle playback.
    
.. describe:: stop()

    Stops the player and unloads the currently playing media file from memory.

.. describe:: seek(position)

    Jump to the specified position within the currently playing item. Parameters:

    * **position**:Number: Requested position in seconds.

.. describe:: setVolume(volume)

    Sets the player's audio volume. Parameters:
    
    * **volume**:Number: The new volume percentage; *0* and *100*.



Events
------

Here is a list of all events the player supports. In javascript, you can listen to events by assigning a function to it. Your function should take one argument (the event that is fired). Here is a code example, with some javascript that listens to changes in the volume:

.. code-block:: javascript
    
    jwplayer("container").onVolume(
        function(event) { 
            alert("the new volume is: "+event.volume);
        }
    );

Note that our :ref:`official embed method <embed>` contains a shortcut for assigning event listeners, directly in the embed code:

.. code-block:: html
    
    <div id="container">Loading the player ...</div>
    
    <script type="text/javascript">
        jwplayer("container").setup({
            flashplayer: "/jwplayer/jwplayer.swf",
            file: "/uploads/video.mp4",
            height: 270,
            width: 480,
            events: {
                onVolume: function(event) { 
                    alert("the new volume is: "+event.volume);
                }
            }
        });
    </script>


And here's the full event list:

.. describe:: onBufferChange(callback)

    Fired when the currently playing item loads additional data into its buffer. Event attributes:

    * **percent**: Number: Percentage (between 0 and 100); number of seconds buffered / duration in seconds.

.. describe:: onBufferFull(callback)

    Fired when the player's buffer has exceeded the player's bufferlength property (default: 1 second). No attributes.

.. describe:: onError(callback)

    Fired when an error has occurred in the player. Event attributes:

    * **message**: String: The reason for the error.

.. describe:: onFullscreen(callback)

    Fired when the player's fullscreen mode changes. Event attributes:
    
    * fullscreen: boolean. New fullscreen state.

.. describe:: onMeta(callback)

    Fired when new metadata has been discovered in the player. Event attributes:

    **data**: Object: dictionary object containing the new metadata. 

.. describe:: onMute(callback)

    Fired when the player has gone into or out of the mute state. Event attributes: 

    * **mute**: Boolean: New mute state.

.. describe:: onPlaylist(callback)

    Fired when a new playlist has been loaded into the player. Event attributes: 
    
    * **playlist**: Array: The new playlist; an array of PlaylistItem objects.

.. describe:: onPlaylistItem(callback)

    Fired when the player is playing a new media item. Event attributes:

    * **index** Number: Zero-based index into the playlist array (e.g. 0 is the first item).

.. describe:: onReady(callback)

    Fired when the player has initialized and is ready for playback. No attributes.

.. describe:: onResize(callback)

    Fired when the player's dimensions have changed (the player is resizing or switching fullscreen). Event attributes:

    * **width**: Number: The new width of the player.
    * **height**: Number: The new height of the player.

.. describe:: onPlay(callback)

    Fired when the player enters the *PLAYING* state. Event attributes:

    * **oldstate**: String: the state the player moved from. Can be *PAUSED* or *BUFFERING*.

.. describe:: onPause(callback)

    Fired when the player enters the PAUSED state. Event attributes:

    * **oldstate**: String: the state the player moved from. Can be *PLAYING* or *BUFFERING*.

.. describe:: onBuffer(callback)

    Fired when the player enters the BUFFERING state. Event attributes:

    * **oldstate**: String: the state the player moved from. Can be *PLAYING*, *PAUSED* or *IDLE*.

.. describe:: onIdle(callback)

    Fired when the player enters the IDLE state. Event attributes:

    * **oldstate**: String: the state the player moved from. Can be *PLAYING*, *PAUSED* or *BUFFERING*.

.. describe:: onComplete(callback)

    Fired when the player has finished playing the current media. No event attributes.

.. describe:: onTime(callback)

    When the player is playing, fired as the playback position gets updated. This happens with a resolution of 0.1 second, so there's a lot of events! Event attributes:

    * **duration**: Number: Duration of the current item in seconds.
    * **offset**: Number: When playing streaming media, this value contains the last unbuffered seek offset.
    * **position**: Number: Playback position in seconds.

.. describe:: onVolume(callback)

    Fired when the player's volume changes. Event attributes:

    * **volume**: Number: The new volume percentage (0 to 100).



Chaining
--------

Note that every API call to a JW Player in turn returns the player instance. This makes it possible to chain API calls  (like with `jQuery <http://jquery.net>`_):

.. code-block:: javascript

    jwplayer().setVolume(50).onComplete(function(){ alert("done!"); }).play();


