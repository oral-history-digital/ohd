.. _media:

Media Support
=============

This page lists all media file formats the JW Player supports: video, sound, images and Youtube clips. 

Single media files can be grouped using :ref:`playlists <playlists>` and streamed over :ref:`http <http>` or :ref:`rtmp <rtmp>` instead of downloaded. Both options do not change the set of supported media formats.

.. note:: The player always tries to recognize a file format by its extension. If no suitable extension is found, **the player will presume you want to load a playlist**! Work around this issue by setting the :ref:`type option <options>`.


Video
-----

The player supports video (*type=video*) in the following formats: 

.. describe:: H.264 ( .mp4, .mov, .f4v )

   Video in either the  `MP4 <http://en.wikipedia.org/wiki/MP4>`_ or `Quicktime <http://en.wikipedia.org/wiki/Quicktime>` container format. These files must contain video encoded with the `H.264 <http://en.wikipedia.org/wiki/H.264>`_ codec and audio encoded with the `AAC <http://en.wikipedia.org/wiki/AAC>`_ codec. H264/AAC video is today's format of choice. It can also be played on a wide range of (mobile) devices.

   .. note::

      If you cannot seek within an MP4 file be before it is completely downloaded, the cause of this problem is that the so-called MOOV atom (which contains the seeking information) is located at the end of your video.  Check out `this little application <http://renaun.com/blog/2007/08/22/234/>`_ to parse your videos and fix it.


.. describe:: FLV ( .flv )

   Video in the `Flash Video <http://en.wikipedia.org/wiki/Flv>`_ container format. These files can contain video encoded with both the ON2 `VP6 <http://en.wikipedia.org/wiki/VP6>`_ codec and the `Sorenson Spark <http://en.wikipedia.org/wiki/Sorenson_Spark>`_ codec. Audio must be in the `MP3 <http://en.wikipedia.org/wiki/MP3>`_ codec. FLV is a slightly outdated format. It is also unique to Flash.

  .. note::

      If the progress bar isn't running with your FLV file, or if your video dimensions are wrong, this means that your FLV file doesn't have metadata. Fix this by using the small tool from `buraks.com <http://www.buraks.com/flvmdi/>`_.


.. describe:: 3GPP ( .3gp, .3g2 )

   Video in the  `3GPP <http://en.wikipedia.org/wiki/3GP>`_ container format. These files must contain video encoded with the `H.263 <http://en.wikipedia.org/wiki/H.263>`_ codec and audio encoded with the `AAC <http://en.wikipedia.org/wiki/AAC>`_ codec. Used widely for mobile phones because it is easy to decode. More and more devices switch to H264 though.

.. describe:: AAC ( .aac, .m4a )

   Audio encoded with the `AAC <http://en.wikipedia.org/wiki/AAC>`_ codec. Indeed, this is not video! However, the player must use the **video** type to playback this audio, since the **sound** type only supports MP3. State of the art codec, widely supported.


Sound
-----

The player supports sounds (*type=sound*) in the following formats: 

.. describe:: MP3 ( .mp3 )

   Audio encoded with the `MP3 <http://en.wikipedia.org/wiki/MP3>`_ codec. Though not as good as AAC, MP3 is very widely used. It is also support by nearly any device that can play audio.

   .. note::

      If you encounter too fast or too slow playback of MP3 files, it contains variable bitrate encoding or unsupported sample frequencies (eg 48Khz). Please stick to constant bitrate encoding and 44 kHz. The `free iTunes software <http://www.apple.com/itunes>`_ has an MP3 encoder built-in.

Images
------

The player supports images (*type=image*) in the following formats:


.. describe:: JPEG ( .jpg )

   Images encoded with the `JPEG <http://en.wikipedia.org/wiki/JPEG>`_ algorythm. No transparency support.

.. describe:: PNG ( .png )

   Images encoded with the `PNG <http://en.wikipedia.org/wiki/PNG>`_ algorythm. Supports transparency.

.. describe:: GIF ( .gif )

   Images encoded with the `GIF <http://en.wikipedia.org/wiki/GIF>`_ algorythm. Supports transparency, but pixels can only be opaque or 100% transparent.

   .. note::

      The player does NOT support animated GIFs.

.. describe:: SWF ( .swf )

   Drawings/animations encoded in the `Adobe Flash <http://en.wikipedia.org/wiki/SWF>`_ format. Supports transparency.

.. note::

   Though SWF files load in the player, it is discouraged to use them. The player cannot read the duration and dimensions of SWF files. Custom scripts inside these SWF files might also interfere with (or break) playback.


Youtube
-------

The player includes native support for playing back Youtube videos (*type=youtube*). Youtube playback is automatically enabled when the **file** option is assigned to the URL of a Youtube video (e.g. *http://www.youtube.com/watch?v=WuQnd3d9IuA*).

The player uses the official `Youtube API <http://code.google.com/apis/youtube/>`_ for this functionality, so this is definitely not a hack. Youtube officially support playback of its content in third-party players like the JW Player.

The Youtube API is accessed through a bridge, the separate **yt.swf** file included in the player download. 

.. note::

   In order for Youtube videos to play, you must upload the *yt.swf* file to the same directory as the *player.swf*.
