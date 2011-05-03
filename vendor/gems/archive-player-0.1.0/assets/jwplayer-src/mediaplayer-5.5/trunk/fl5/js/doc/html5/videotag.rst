.. _videotag:

HTML5 Video Tag Reference
=========================

This guide provides an overview of the functionalities and options provided by the HTML5 <video> tag. It includes a few examples, plus a list of known browser-specific quirks.



Introduction
------------

Our HTML5 player is designed to gracefully enhance videos embedded with the HTML5 *<video>* tag. For a complete reference, visit the `W3C HTML5 video element draft <http://www.w3.org/TR/html5/video.html>`_.

Example
-------

Here is a basic example of a video embedded with the HTML5 video tag:

.. code-block:: html

   <video height="270" src="/static/bunny.mp4" width="480" controls>
     <a href="/static/bunny.mp4">Download this video</a>
   </video>

This example will display the video in 480 by 270 pixels with a small controlbar over it. Browsers that do not support the video tag (nor the MP4 video) will render the enclosed download link instead.



Attributes
----------

The HTML5 *<video>* tag has a short list of useful attributes:

.. describe:: autoplay ()

   Include this attribute (no value) to let the video start as the page gets loaded. Use sparsely, since this might get annoying.

.. describe:: controls ()

   Include this attribute (no value) to display a simple controlbar, provided by the user agent. The looks of this controlbar vary per browser.

.. describe:: height (number)

   Height of the video on the page, in pixels is required.&nbsp;</li>

.. describe:: loop ():

   Include this attribute to let the browser continously repeat playback of the video. At present, no browser honors this attribute. More info below, under *browser quirks*

.. describe:: poster (string) 

   The url of a poster frame that is shown before the video starts. Can be any PNG, JPG or GIF image. Is *undefined* by default.

.. describe:: preload (*auto*, *metadata*, *none*)

   This attribute defines whether the video is entire loaded on page load, whether only the metadata is loaded on page load, or whether the video isn't loaded at all. At present, no browser honors this attribute. More info below, under *browser quirks*,

.. describe:: src (string)

   The URL of the video to play. This is not required, since source files can also be listed using *<source>* tags (see below). It is *undefined* by default. See :ref:`formats` for more info on which browser supports which filetype.

.. describe:: width (*number*)

   Width of the video on the page, in pixels. Is required.

Here is another example of an HTML5 video tag, this time using more attributes:

.. code-block:: html

   <video
     controls 
     height="270" 
     loop
     poster="/static/bunny.jpg"
     src="/static/bunny.mp4" 
     width="480">
     <a href="/static/bunny.mp4">Download the video</a>
   </video>


This example will display the video with a poster frame and controls. After starting the video, it will repeat playback.


Multiple Sources
----------------

It is possible to provide a video tag with multiple source videos. The browser can then pick whichever file it can playback. This functionality works through the HTML5 *<source>* tag, which can be nested inside the *<video>* tag. A common use case is the provision of two videos, one in OGG for Firefox/Opera and one in MP4 for Chrome/Safari/iPhone/iPad:

.. code-block:: html

   <video height="270" width="480" controls>
     <source src="/static/bunny.mp4" type="video/mp4">
     <source src="/static/bunny.ogg" type="video/ogg">
     <a href="/static/bunny.mp4">Download the video</a> for local playback.
   </video> 


This example will play the MP4 video in Chrome/Safari and the OGG video in Firefox/Opera. Note that Chrome will play the OGG file if you reverse the order of the two *<source>* tags (Chrome supports both formats). We strongly advise against this though: MP4 files render much more smoothly and seek effortlessly in Chrome, whereas OGG files don't.

Defining codecs
^^^^^^^^^^^^^^^

The video type can be specified in more detail by amending the codecs of the mediafile to the mimetype. Here is an example in which we explicitly specify that the first video uses H.264 Baseline video / AAC Low-complexity audio and the second video uses Theora video and Vorbis audio:

.. code-block:: html

   <video height="270" width="480" controls>
     <source src="/static/bunny.mp4" type="video/mp4; codecs='avc1.42E01E, mp4a.40.'">
     <source src="/static/bunny.ogg" type="video/ogg; codecs='theora, vorbis'">
    <a href="/static/bunny.mp4">Download the video</a>
   </video>

This additional level of detail is very useful at such instances where nonstandard codecs are used. For example, the MP4 video could be using H.264 High profile video, which would cause e.g. the iPhone/iPad to not support it. A more extensive overview of supported codecs and mimetypes can be found in :ref:`formats`.


Browser Quirks
--------------

The W3C HTML5 video format is still in draft. Therefore, browser might have implemented older versions of this draft or filled the gaps with custom implementations. Especially around subjects like `event broadcasting <http://developer.longtailvideo.com/trac/wiki/HTML5BrowserCompatability>`_ and `(pseudo)streaming <http://developer.longtailvideo.com/trac/ticket/835>`_, things are still very buggy. Here are a couple issues worth noting:

No single codec
^^^^^^^^^^^^^^^

The biggest issue to be aware of - it's actually hard to have missed this in the press - is that there is no single video format supported by all browsers. Firefox and Opera support the *OGG* format, Internet Explorer (9), Safari and the iPhone/iPad support the *MP4* (H264) format. Chrome does both. Our HTML5 player works around this issue by including a :ref:`Flash player fallback <embed>` for Firefox/Opera and current versions of IE (6/7/8). Including only an *OGG* in a video tag is not recommended; most browsers (and Flash) would not be able to render it.

Always preloading
^^^^^^^^^^^^^^^^^

A second browser quirk to be aware of is that any browser that currently supports HTML5 will actually preload your video on page load. The tag's *preload* attribute is not honored. This is probably a temporary issue, but it is an important one: unwatched preloaded video is wasted bandwidth. Our HTML5 player works around this issue by clearing the <em>source</em> attribute of a video tag op page load and reinserting it after the user has clicked *play*.

No looping
^^^^^^^^^^

Third, none of the browsers that currently implement HTML5 video support the *loop* attribute. Our player works around this issue by parsing out the *loop* attribute, mapping it to the player's *repeat* option and using scripting to re-start a video after it has completed.