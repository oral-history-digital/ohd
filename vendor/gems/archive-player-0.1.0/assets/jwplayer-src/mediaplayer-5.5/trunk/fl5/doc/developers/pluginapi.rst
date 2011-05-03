.. _pluginapi:

=======================
Actionscript Plugin API
=======================

JW Player 5 supports a flexible API for :ref:`plugins <buildingplugins>`, that can be  written in `actionscript <http://en.wikipedia.org/wiki/ActionScript>`_. It is possible to read the config/playlist variables of the player, call player functions, and listen for :ref:`Flash Events <pluginevents>`.

Version 5 also supports a :ref:`JavaScript API <javascriptapi>`, and it can load `Version 4 plugins <http://developer.longtailvideo.com/trac/wiki/Player4Api>`_ as well.

Initialization
==============

All plugins have to define a function called *initPlugin(player, config)*. This function will be called by the player when it is :ref:`initialized <startup>` . A reference to the `Player <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/player/IPlayer.as>`_ is passed to this function, so the plugin can instantly read the config/playlist, call player functions and assign event listeners.  A `PluginConfig <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/plugin/PluginConfig.as>`_ object, which contains plugin-specific configuration parameters, is passed in as an argument to *initPlugin* as well.

Plugins also need to implement a *resize(width, height)* function and an *id* getter.  Here is an example of a valid (but empty) plugin:

.. code-block:: actionscript

	import com.longtailvideo.jwplayer.player.IPlayer;
	import com.longtailvideo.jwplayer.plugins.PluginConfig;
	
	public class MyPlugin extends Sprite implements IPlugin {
	
		private static var myID:String = "myplugin";
	
		private var api:IPlayer;
		private var config:PluginConfig;
	
		public function initPlugin(player:IPlayer, conf:PluginConfig):void {	
			this.api = player;
			this.config = conf;
		}
	
		public function get id():String {	
			return myID;
		}
	
		public function resize(width:Number, height:Number):void {	
			// Implement resizing if necessary
		}
	}


Reading variables
=================

There are three variable calls you can make through the player API:

 * **config** returns a `PlayerConfig <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/model/PlayerConfig.as>`_ object with all of the :ref:`settings <options>` loaded into the player.
 * **playlist** returns a `Playlist <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/model/Playlist.as>`_ object containing all of its `PlaylistItems <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/model/PlaylistItem.as>`_. For a single file, the list will have only one entry. 
 * **config.pluginConfig(name)** returns a `PluginConfig <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/plugins/PluginConfig.as>`_ object with all the flashvars for a particular plugin (for example the included *controlbar* or the externally loaded *yousearch*). Additionally, every plugin config will contain an *x*, *y*, *width*,*height* and *visible* variable that pertain to its positioning.

Here are three calls to the player which illustrate reading variables from the player API

.. code-block:: actionscript

	// See what the repeat flashvar was configured to
	var repeat:String = player.config.repeat
	// The title of the second playlist item
	var title:String = player.playlist.getItemAt(1).title;
	// The current width of the controlbar
	var barWidth:Number = player.pluginConfig('controlbar')['width'];


Player commands
===============

The ActionScript API exposes the following player commands:

 * fullscreen(state:Boolean)
 * load(item:*)
 * mute(state:Boolean)
 * pause()
 * play()
 * playlistItem(i:Number)
 * playlistNext()
 * playlistPrev()
 * redraw()
 * seek(pos:Number)
 * stop()
 * volume(vol:Number)

Here are some examples of how to call these functions:
 
.. code-block:: actionscript

	// Mute the player
	player.mute(true);
	// Load a new video into the player
	player.load("http://www.mysite.com/mycoolvideo.mp4");


Setting listeners
=================

Any of the events described in the :ref:`Player Events <pluginevents>` page can be listened for using the Flash Event model.  To listen for a player event, simply call the *addEventListener()* function on the player API.

An example:

.. code-block:: actionscript

	import com.longtailvideo.jwplayer.events.*;

	private function muteTracker(evt:MediaEvent) { 
	    trace('the new mute state is: '+evt.mute); 
	}

player.addEventListener(MediaEvent.JWPLAYER_MEDIA_MUTE, muteTracker);


And an example removal call:

.. code-block:: actionscript

	player.removeEventListener(MediaEvent.JWPLAYER_MEDIA_MUTE, muteTracker);

.. note:: Your plugin will need to include the `com.longtailvideo.jwplayer.events package <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/events/>`_  in order to avoid compilation errors.


Player Controls
===============

The player contains several built-in user controls, which have their own APIs.  For example:

 * The **controlbar** offers an *addButton()* call, used to insert a custom button in the controlbar.
 * The **dock** offers an *addButton()* call, used to insert a custom button in the dock.

Here's example code that tries to insert a button in the dock and then in the controlbar:
 
.. code-block:: actionscript

	var api:IPlayer;
	var icon:DisplayObject;
	
	function clickHandler(evt:MouseEvent):void { 
		trace('Demo button clicked!');
	}
	
	function initPlugin(player:IPlayer, conf:PluginConfig):void {
	    api = player;
	    if(api.config.dock) { 
	        api.controls.dock.addButton(icon, "Click here", clickHandler);
	    } else {
	        api.controls.controlbar.addButton(icon, "Click here", clickHandler);
	    }
	}
