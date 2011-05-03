.. _formats:

Supported file formats
======================

The HTML5 player can play a wide range of media formats. Since the player includes an `Adobe Flash <http://get.adobe.com/flashplayer>`_ based fallback, the list of formats is not restricted to formats the browsers can play, but also extends to formats the Flash Plugin can play. The exact list of supported formats varies per browser and per device.

Video formats
-------------

Generally, the following video formats are supported by the player:

.. describe:: H264 video / AAC audio in the MP4 container

   Supported for Safari 4+, Chrome 3+, Internet Explorer 9+ and as part of the the Flash fallback.

.. describe:: H264 video / AAC Audio in the MOV container. 

    Supported for Safari 4+ and as part of the the Flash fallback.

.. describe:: Theora video / Vorbis audio in the Ogg container

   Supported for Firefox 3.5+, Opera 10.5+, Chrome 4+ and as part of the the Flash fallback.

.. describe:: VP8 video / Vorbis audio in the WebM (Matroska) container

   Supported for Opera 10.54+; more browsers coming.

.. describe:: VP6 video / MP3 audio in the FLV container

   Supported as part of the the Flash fallback.

.. describe:: Spark (H263) video / MP3 audio in the FLV container

   Supported as part of the the Flash fallback.

Note the use of the word **generally**, since support also depends upon such variables as the dimensions of the video and/or the encoding profile used. For example, the iPhone `supports H264 video <http://www.apple.com/iphone/specs.html>`_, but only in the Baseline profile up to 640 by 480 pixels.


.. todo:

    Audio formats
    -------------

    The following audio formats are supported by the player:

    MP3 audio in the MP3 container (example). 
    Supported for Safari 4+, Chrome 3+, Internet Explorer 9+ and as part of the the Flash fallback.
    AAC audio, in the MP4 container (example). 
    Supported for Safari 4+, Chrome 3+, Internet Explorer 9+ and as part of the the Flash fallback.
    Vorbis audio in the Ogg container (example) 
    Supported for Firefox 3.5+, Opera 10.5+ and Chrome 4+.


Determining Support
-------------------

There are three parameters the player uses to determine if a certain video is supported on a certain device: *file extension*, *mimetype* and *codecs*. A mimetype + codecs listing is the most accurate way for the player to determine if a format is supported. In case only a mimetype or a file extension is available, the player presumes certain codecs to check if support is available.

Under water, the player uses the *video.canPlayType()* method to ask a browser if it can play a video. In other words, there's no *if(IE) {} elseif(Firefox) {}* things going on. 


Codecs
^^^^^^

A codec listing looks like this:

.. code-block:: html

   <video width="400" height="200" id="player">
     <source src="/static/video.mp4" type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'">
     <source src="/static/video.webm" type="video/webm; codecs='vp8, vorbis'">
     <source src="/static/video.ogv" type="video/ogg; codecs='theora, vorbis'">
   </video>

Here's a list of frequently-used codecs:

.. describe:: avc1.42E01E, mp4a.40.2

   Baseline profile H264 video / Low-complexity AAC audio.

.. describe:: avc1.4D401E, mp4a.40.2

   Main profile H264 video / Low-complexity AAC audio.

.. describe:: avc1.64001E, mp4a.40.5

   High profile H264 video / Low-complexity AAC audio.

.. describe:: theora, vorbis

   Theora video and Vorbis audio.

.. describe:: vp8, vorbis

   VP8 video and Vorbis audio.

Mimetypes
^^^^^^^^^

The mimetype tells the user agent what video container is being used. It's more fuzzy than a list of codecs, since most containers contain audio and video in multiple codecs. Below is what just a mimetype listing looks like:

.. code-block:: html

   <video width="400" height="200" id="player">
     <source src="/static/video.mp4" type="video/mp4">
     <source src="/static/video.webm" type="video/webm">
     <source src="/static/video.ogv" type="video/ogg">
   </video>

Here is a list of frequently-used mimetypes and the codecs the player presumes:

.. describe:: video/mp4

   MP4 video. The player presumes H264 baseline video and AAC low-complexity audio.

.. describe:: video/ogg

   Ogg video. The player presumes Theora video and Vorbis audio.

.. describe:: video/webm

   WebM video. The player presumes VP8 video and Vorbis audio.

.. describe:: video/quicktime

   Quicktime video. The player presumes H264 baseline video and AAC low-complexity audio.

.. describe:: video/flv

   Flash video. The player presumes no codec, but switches straight to Flash fallback.

Extensions
^^^^^^^^^^

A file extension is even fuzzier than a mimetype, since several extensions are sometimes used for content with a single mimetype. The most frequent use case for only a file extension is when a video is embedded without *<source>* tags:

.. code-block:: html

   <video width="400" height="200" id="player" src="/static/video.mp4"></video>

Again, a list of frequently used file extensions and the mimetype/codecs the player presumes:

.. describe:: .mp4, .m4v, .f4v: 

   The player presumes H264 baseline video and AAC low-complexity audio in an MP4 container.

.. describe:: .webm: 

   The player presumes VP8 video and Vorbis in a WebM container.

.. describe:: .ogg, .ogv

   Ogg video. The player presumes Theora video and Vorbis audio in an Ogg container.

.. describe: .webm

   WebM video. The player presumes VP8 video and Vorbis audio in a WebM (Matroska) container.

.. describe:: .mov

   The player presumes H264 baseline video and AAC low-complexity audio in a Quicktime container.

.. describe:: .flv

   The player presumes a Flash container and tries the Flash fallback.

Determining Flash Support
-------------------------

The player will try a fallback to Flash if the following three items check out:

 * The :ref:`flashplayer option <options>` needs to be set.
 * The browser has the Flash plugin version 9.0.115 or higher installed (checked with javascript).
 * The video is in MP4, Quicktime or Flash format. Codecs are not checked.

There are obvious cases in which the Flash fallback is enabled (such as MP4 video in Firefox), and less obvious cases (such as MP4 video with the H.264 HIGH codec in Chrome). In the latter case, the player profits from the more extensive H.264 support in Flash when compared to the browser. This will only work if you properly specify the used codecs in the *<source>* type attribute.
