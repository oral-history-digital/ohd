.. _architecture:

JW Player Architecture
======================

This page gives a high level overview of the features and structure of the JW Player: its configuration through options, skinning and plugin loading, event structure, file loading and resizing process. Here's a simple schematic of the internal structure of the player:

.. image:: ../assets/overview.png
	:alt: Architecture Overview

Flashvars
---------

First, all :ref:`options` are loaded, by the **Configger** utility class. Options are used to change the layout and behaviour of the player. You also use options to load :ref:`files <media>` or plugins into the player. Options are set by adding a :ref:`flashvars <embed>` attribute to the HTML code that embeds the player in your site.

Skinning
--------

After the flashvars are loaded, the player proceeds to loading a skin, if you :ref:`have set one <embed>`. A skin is an external SWF file that provides a new look to the player. A number of skins is available as a free download in our `addons repository <http://www.longtailvideo.com/addons/skins>`_.


Event structure
---------------

When the skin is loaded, the player will initialize its internal framework, the `MVC triad <http://en.wikipedia.org/wiki/Model-view-controller>`_. It splits up the functionality of the player in three sections:

.. describe:: The Model

   It manages the playback of the videos and contains a string of classes that can each playback a specific :ref:`file <media>` (e.g. *video*) or :ref:`rtmp <rtmp>` or :ref:`http <http>` stream.

.. describe:: The View

   It manages all user interfaces: the built-in components, the externally loaded plugins and the javascript API.

.. describe:: The Controller

   It checks and forwards all directive from the *View* to the *Model*. It also manages the internal playlist, including such functionalities as shuffle and repeat.


Plugins
-------

After the MVC framework is initialized, the plugins are being loaded (if the :ref:`plugins flashvar <options>` is set). Plugins are standalone SWF files that add functionality to the player (e.g. for closed captioning or advertisements). There's a big number of plugins available `in our repository <http://www.longtailvideo.com/addons/plugins>`_.

Some plugins have their own flashvars (e.g. the *captions.file* flashvar for the *captions* plugin), to customize them or tell them which files to load. These flashvars (that always begin with the name of the plugin and a dot) were already loaded in step 1 of the player initialization, so plugins can immediately setup themselves.


PlayerReady
-----------

When all plugins are loaded the player is completely ready to start playback. At this point the player sends a ping to a :ref:`playerReady function <api>` in javascript. When sent, the player is ready to receive events from and send events to javascript.

Next, the player will also send two events itself to get things started:

 * The player will send a  :ref:`LOAD event <api>`, loading the video or playlist.
 * The player sends a  :ref:`RESIZE event <api>`, so all plugins and components can resize themselves to the stage.

Both these events are explained in  more detail below.

File loading
------------

Because the JW Player handles a wide range of filetypes and formats, the file loading features a small decision list to determine which playback *model* to use:

 1. First, the player checks if a :ref:`type option <options>` is set (e.g. *type=rtmp*). If it is, the player loads the file and assigns the set playback type.
 2. If there is no *type* option, the player looks at the extension of the *file* option. If it is a known media :ref:`format <media>` (e.g. *.mp4**), the player will load the file and assigns the right playback type (e.g. *video*). If the extension is not a known media format (e.g. *.xml*), the player will presume the file is a playlist. It tries to load and parse the :ref:`playlist <playlists>`.
 3. When the playlist is loaded and parsed, the player repeats step 1 and 2 for every entry in the playlist. If any of these entries have no *type* option and no known extension, they are dropped.
 
Next, if the file or playlist has loaded and the *autostart* option is turned on, the player will also immediately start playback.

Resizing
--------

The JW Player resizes itself automatically to the dimensions of the Flash container in HTML. The resizing is managed like this:

 * At the beginning of each resize operation, the *display* gets the entire stage.
 * Next, the player walks through every plugin to see if it has a *size* and *position* flashvar set. For example, the  *controlbar* has a default *bottom* position and *20* pixels size. The player adjusts the display dimensions for that.
 * Some components (such as the *dock*) have their position set to *over*. The player will then simply set the dimensions of this plugin to match those of the display.
 * When all component dimensions have been calculated, the player issues a :ref:`RESIZE event <api>`. Next, it is up to each plugin then to position itself where the player wants it to be.

Here's an image that illustrates the resizing functionality. Next to the display, it contains for components/plugins that requested screen estate:

.. image:: ../assets/pluginspace.png
	:alt: Plugin screen estate model

In fullscreen, the screen-division mechanism is not used. Instead, the '''display''' is given all screenspace. Only the components that are *over* the display will be visible. The *controlbar* will automatically be set to *over* in fullscreen mode.