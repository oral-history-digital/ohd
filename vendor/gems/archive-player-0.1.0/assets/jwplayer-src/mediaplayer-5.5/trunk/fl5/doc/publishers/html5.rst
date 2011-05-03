.. _html5:

HTML5 Support in the JW Player
------------------------------

JW Player 5.3 introduces support for browser-based video playback via the HTML5 <video> tag. While HTML5 video is still very early in its development, JW Player 5.3 makes it possible to use HTML5 video and Flash video in concert with one another, with little discernable difference from the perspective of publishers and viewers. From configuration to skins and the API, we've worked hard to make sure that everything works seamlessly in both HTML5 and Flash.

Enhancements
============

The single biggest advantage of HTML5 support for the JW Player is that it opens the door for playback of a wide variety of video that would have previously been inaccessible. This is accomplished in several ways.

First, is now possible to view your video content on an array of cutting edge devices (such as the iPad, iPod, and iPhone) where previously it would not have been viewable. Furthermore, HTML5 video utilizes built-in video hardware acceleration, which can simultaneously improve the quality of video playback and system performance.

Additionally, HTML5 video supports a wider variety of video codecs than Flash. Video contains much more data than text, images, or audio. As a result, it's necessary to compress video if you intend on distributing it to a large audience. An algorithm that describes how to compress video or audio is called a codec.

Codecs are generally quite complex, and many people have invested a great deal of time and money in developing them. Not surprisingly, individuals who have developed the technologies that go into codecs have worked hard to protect them and to extract licensing fees for their work.

Because of licensing issues, support for the most prominent video codecs is scattered across browsers, as outlined in the table below.

+------+---------+-----+-------+------+------+-----+----+-------+
|      |Flash    |IE   |Firefox|Safari|Chrome|Opera|iOS |Android|
+======+=========+=====+=======+======+======+=====+====+=======+
|Theora|         |     |3.5+   |      |5.0+  |10.5+|    |       |
+------+---------+-----+-------+------+------+-----+----+-------+
|H.264 |9.0.115.0|9.0+ |       |3.0+  |5.0+  |     |3.0+|2.0+   |
+------+---------+-----+-------+------+------+-----+----+-------+
|WebM  |         |     |4.0+   |      |6.0+  |10.6+|    |       |
+------+---------+-----+-------+------+------+-----+----+-------+
Figure 1: Codec compatibility (based off of http://diveintohtml5.org/video.html).

Limitations
===========

Technical Limitations
#####################
While we've endeavored to make the player identical in HTML5 and Flash modes, there are certain technical limitations that make it impossible to do so.

iOS specific limitations
^^^^^^^^^^^^^^^^^^^^^^^^^^^
Apple is very restrictive about what elements of a video can be controlled programmatically on iOS devices. For example, fullscreen and volume can only be controlled via the built-in controlbar. As a result, the JW Player uses the native iOS controls continues to send out all API events. Additionally, some API commands will not function as expected.

No RTMP
^^^^^^^
RTMP is a proprietary streaming video technology developed by Adobe. It is not compatible with HTML5 <video>.

No FLVs
^^^^^^^
Like RTMP, FLV is a proprietary technology developed by Adobe as a video container format. While it may contain H.264 encoded video, no browser is able to play it back. For this reason, it's better to use the MP4 container if you plan on using your video in both Flash and HTML5.

No "Real" Fullscreen
^^^^^^^^^^^^^^^^^^^^
While Flash has supported fullscreen since Flash Player 9.0.28.0, the specification for HTML5 video does not require that browsers offer a fullscreen mode. Consequently, a few browsers offer this functionality, but it is not widespread. When "real" fullscreen is available (ie Flash and certain browsers), the JW Player will take advantage of it. Otherwise, we will maximize video to the browser window dimensions.

Current Player Limitations
##########################
While HTML5 introduces some technical limitations in terms of what will be possible, there are certain features we simply couldn't fit into this release.

Plugin Support
^^^^^^^^^^^^^^
The HTML5 mode of the JW Player does not support plugins. In the coming weeks, we'll be working to finalize a new JavaScript plugin model and to put together an SDK so that developers can start writing JavaScript plugins. Long-term, we'll begin converting plugins from Flash plugins into JavaScript plugins.

Zipped Skins
^^^^^^^^^^^^
While we really love the simplicity of our zipped skinning, there's no good way to unzip files in JavaScript. We're working on a new skinning format to get around this limitation, but in the mean time, you'll need to go ahead and unzip your skin on your server. See the embedding guide for detailed instructions on how to do this.

YouTube Failover
^^^^^^^^^^^^^^^^
JW Player 5.3 allows for YouTube playback on all platforms via a specially crafted embed mechanism. Unfortunately, this embed mechanism does not provide an API, and hence, including a YouTube embed disrupts the player. Once YouTube makes their HTML5 API available, we will improve support.

Audio Support
^^^^^^^^^^^^^
In addition to the <video> tag, HTML5 specifies an <audio> tag. While this suffers from many of the same browser licensing issues, it is still possible to playback many forms of audio in many browsers. For JW Player 5.3, we focused on building the most stable and comprehensive video player. We'll be adding <audio> tag support shortly.

No Playlist Parsing
^^^^^^^^^^^^^^^^^^^
Currently, all media requiring playlists must be played in Flash mode as we have not reimplemented our playlists parsers in JavaScript. Once this is done, full playlist support will be available in HTML5 mode.

Missing UI Elements
^^^^^^^^^^^^^^^^^^^
Building high-performance, functional, and intuitive UI elements is an extremely time consuming process. JW Player 5.3 focused on the controlbar and display. Future releases will see the dock and playlist reimplemented in JavaScript as well.