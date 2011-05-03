.. _introduction:

Introduction
============

The JW Player for Flash is the Internet’s most popular and flexible media player. It supports playback of :ref:`any media type <mediaformats>` the `Adobe Flash Player <http://www.adobe.com/products/flashplayer/>`_ can handle, both by using simple downloads, :ref:`httpstreaming` and :ref:`rtmpstreaming`.


The player supports various :ref:`playlist formats <playlistformats>` and a wide range of :ref:`options <options>` (flashvars) for changing its layout and behavior. Embedding the player in a webpage :ref:`is a breeze <embedding>`.


API
---

For JavaScript developers, the player features an extensive :ref:`javascriptapi`. With this API, it is possible to both control the player (e.g. pause it) and respond to playback changes (e.g. when the video has ended).

Addons
------

Both the layout and the behavior of the player can be extended with a range of so-called AddOns. These AddOns are available on the `LongTail Video website <http://www.longtailvideo.com/addons/>`_. There are three categories: skins, plugins and providers

Skins
^^^^^

Skins drastically change the looks of the player. They solely consist of an XML file and a bunch of PNG images, which makes `creating your own skins <skinning>` simple and fun. 

A wide range of professional-looking skins can also be `downloaded <http://www.longtailvideo.com/addons/skins>`_.


Plugins and providers
^^^^^^^^^^^^^^^^^^^^^

Plugins extend the functionality of the player, e.g. in the areas of analytics, advertising or viral sharing. Plugins are loaded from our plugin repository, making them extremely `easy to install <http://www.longtailvideo.com/addons/>`_.

Providers are similar to plugins. They are externally loaded SWF files that can be installed with a single :ref:`option <options>`. Whereas plugins are used to add functionality on top of the player, providers are used to extend the low-level playback functionality of the player, e.g. to support advanced features of a specific CDN or video portal. Providers are new to the 5.x player; a couple of are already available from our `addons repository <http://www.longtailvideo.com/addons/>`_.

It is possible to create your own plugins and providers using Adobe Flash and actionscript, but this is not covered by these publisher-focused documents. Instead, visit `developer.longtailvideo.com <http://developer.longtailvideo.com>`_ to learn more and download the plugin and/or provider SDK.
