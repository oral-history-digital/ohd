.. _buildingplugins:

================
Building Plugins
================

The JW Player supports an API which allows developers to build ActionScript plugins to extend player functionality.  Examples of this added functionality include: ad serving, search engine integration and data analytics. This tutorial is aimed at Flash developers with a solid understanding of ActionScript 3 who want to start developing plugins.

What is a plugin?
=================

A JW Player plugin is a separate SWF file, written in Actionscript 3, which is loaded by the player at runtime. Plugins integrate seamlessly with the player, both in terms of coding (through the :ref:`pluginapi`) and graphics (stacked on top of the player). Plugins are loaded into player by setting the :ref:`plugins <options-api>` option. For example, if you wanted to load two plugins named **advertising.swf** and **delicious.swf**, the corresponding flashvar would be *plugins=advertising,delicious*.  If you used SWFObject 2.x to embed the JW Player, the code would look something like this:


.. code-block:: html

	<script type="text/javascript">
		var flashvars = {
			'file':		'myvideo.flv',
			'plugins':	'advertising,delicious'
		};
		var params = {
			'allowscriptaccess':	'always';
		};
		var attributes = {
			'id':		'single',
			'name':		'single'
		};
	
		swfobject.embedSWF('player.swf', 'single', '700', '450', '9.0.0', 'expressInstall.swf', flashvars, params, attributes);
	</script>

By default, plugins are hosted at **plugins.longtailvideo.com**. This single-repository architecture enables every JW Player on the internet (greater than 1 million live players) to directly load your plugin by setting the :ref:`plugins <options-api>` option.

Getting started
===============

You can develop plugins using the free `Flex SDK <http://www.adobe.com/products/flex>`_ or `Adobe Flash CS4 <http://www.adobe.com/products/flash>`_. We have a handy `plugin development SDK <http://developer.longtailvideo.com/trac/changeset/HEAD/sdks/fl5-plugin-sdk?old_path=/&format=zip>`_ you can use to quickly start building plugins. It contains a copy of the `testing page <http://developer.longtailvideo.com/trac/testing>`_, some plugin templates and the *player-5-lib.swc* library (containing the player API).  Since the `Flex SDK <http://www.adobe.com/products/flex>`_ is free and cross-platform, all you need to start building plugins is a text editor!

**Note:** If you're looking to develop a plugin in order to serve ads in the JW Player, please `contact us <http://www.longtailvideo.com/about/contact-us>`_ beforehand. We have a special SDK for advertisers and advertising networks.

Each plugin should implement `com.longtailvideo.jwplayer.plugins.IPlugin <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/plugins/IPlugin.as>`_:

.. code-block:: actionscript

	package com.longtailvideo.jwplayer.plugins {
	
		public interface IPlugin {
		    function initPlugin(player:IPlayer, config:PluginConfig):void;
		    function resize(width:Number, height:Number):void;
		    function get id():String;
		}
	
	}


The initPlugin() function allows the player to give the plugin a reference to itself, and to pass the plugin's own configuration in a PluginConfig object..  The player automatically calls *initPlugin* after it has loaded the plugin. The *player* parameter is a reference to the player's :ref:`plugin API <pluginapi>`. The `IPlayer <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/player/IPlayer.as>`_ reference allows you to read the player's config and playlist variables, send API requests to the player and listen to events broadcast by the player. A complete overview can be found on the :ref:`Plugin API <pluginapi>` page.

In addition to implementing the IPlugin interface, plugins need to extend the **Sprite** or **Movieclip** class in order for them to be loaded 	into the player as an external SWF file. The most basic plugin to write would look something like this:

.. code-block:: actionscript

	package {
	
		import flash.display.Sprite;
		import com.longtailvideo.jwplayer.player.*;
		import com.longtailvideo.jwplayer.plugins.*;
		
		public class Helloworld extends Sprite implements IPlugin {
		
		    /** Configuration list of the plugin. **/
		    private var config:PluginConfig;
		    /** Reference to the JW Player API. **/
		    private var api:IPlayer;
		
		    /** This function is automatically called by the player after the plugin has loaded. **/
		    public function initPlugin(player:IPlayer, conf:PluginConfig):void {
		        api = player;
		        config = conf;
		        trace("Hello World");
		    }
		
		   /** This should be a unique, lower-case identifier (e.g. "myplugin") **/
		   public function get id():String {
		       return "helloworld";
		   }
		
		   /** Called when the player has resized.  The dimensions of the plugin are passed in here. **/
		   public function resize(width:Number, height:Number):void {
		       // Lay out plugin here, if necessary.
		   }
		
		
		}
	
	}


The `SDK <http://developer.longtailvideo.com/trac/browser/sdks/fl5-plugin-sdk>`_ has a `build script <http://developer.longtailvideo.com/trac/browser/sdks/fl5-plugin-sdk/plugins/player5plugin/build.sh>`_ (build.sh for Mac OS X and Linux, build.bat for Windows) which will use the Flex SDK's mxmlc compiler to :ref:`compile your plugin <compilingplugins>` into a SWF file.  You can also use :ref:`Flash CS4 <compiling-flash-cs4>` to compile plugins.

Interacting with the player
===========================

The `IPlayer interface <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/player/IPlayer.as>`_ is the bridge by which the player and your plugin communicate. The following handful of properties and functions give you full access to the player:

 1. Access the `PlayerConfig object <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/player/PlayerConfig.as>`_, containing all player configuration parameters, through **player.config**.
 2. Access the `Playlist object <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/model/Playlist.as>`_ of the player through **player.playlist**.
 3. Send directives to the player with by calling the `public player commands <http://developer.longtailvideo.com/trac/wiki/Player5Api#Playercommands>`_.
 4. Subscribe to `player events <http://developer.longtailvideo.com/trac/wiki/Player5Events>`_ by calling **player.addEventListener()**.
 5. Add a `dock or controlbar button <http://developer.longtailvideo.com/trac/wiki/Player5Api#PlayerControls>`_.
 6. Request the configuration of another plugin through **player.config.pluginConfig(pluginID)**.  The configuration properties of the core user interface controls (**controlbar**, **playlist**, **dock** and **display**) are also available through this interface (e.g. **player.config.pluginConfig('controlbar')**).

.. note:: Due to a Flash player embedding bug having to do with passing flashvars whose names contain both "." characters and upper and lower-case letters, the player converts all flashvar names to lower case.  It is highly encouraged to restrict configuration names to all-lowercase characters.

A complete overview of all available calls can be found on the :ref:`Plugin API Reference Page <pluginapi>`. 

Here's a plugin code snippet that listens to changes in the playback position:

.. code-block:: actionscript

	public function initPlugin(player:IPlayer, config:PluginConfig):void  {
	    player.addEventListener(MediaEvent.JWPLAYER_MEDIA_TIME, timeHandler);
	}

	private function timeHandler(evt:MediaEvent):void {
	    Logger.log("the new position is: "+evt.position);
	}


Here's another snippet that loads a specific video once the user clicks a button:

.. code-block:: actionscript

	private var button:Sprite;
	private var video:String = "http://www.mysite.com/video/myVideo.flv";
	private var player:IPlayer;
	
	public function initializePlugin(ply:IPlayer, conf:PluginConfig) {
	    player = ply;
	    button.addEventListener(MouseEvent.CLICK,loadVideo);
	}
	
	private function loadVideo(evt:MouseEvent):void {
	    player.load(video);
	}
	
	
This last snippet implements the resize method so the plugin can be rescaled after a resize:
	
.. code-block:: actionscript

	private var config:PluginConfig;
	private var rectangle:MovieClip;
	private var player:IPlayer;
	
	public function initializePlugin(ply:IPlayer, cfg:PluginConfig):void { 
	    player = ply;
	    config = cfg;
	}
	
	public function resize(width:Number, height:Number):void {
	    // A plugin config contains the x,y,width,height position of the plugin and is automatically updated.
	    rectangle.x = config['x'];
	    rectangle.y = config['y'];
	    rectangle.width = config['width'];
	    rectangle.height = config['height'];
	}


Note that the `plugins package <http://developer.longtailvideo.com/trac/browser/trunk/as3/com/jeroenwijering/plugins>`_ contains a string of example plugins you can borrow code snippets from. 

There's also a separate tutorial that `describes step by step how to build the Yousearch plugin <http://developer.longtailvideo.com/trac/wiki/YousearchTutorial>`_. The Yousearch plugin shows a small Youtube search box on stage, used to load Youtube videos.


Loading Data
============

Basic configuration parameters for a specific plugin can be loaded through the same flashvars mechanism the player uses itself. Variables for a specific plugin must be prepended with the name of the plugin and a dot. So if your plugin is called *delicious*, your variable names must start with the *delicious.* string. Example:

.. code-block:: html

	<script type="text/javascript">
		var flashvars = {
			'file':					'myvideo.flv',
			'plugins':				'delicious',
			'delicious.user':		'jeroenw',
			'delicious.tags':		'coolstuff,videos'
		};
		var params = {
			'allowscriptaccess':	'always';
		};
		var attributes = {
			'id':					'single',
			'name':					'single'
		};
	
		swfobject.embedSWF('player.swf', 'single', '700', '450', '9.0.0', 'expressInstall.swf', flashvars, params, attributes);
	</script>


All the flashvars set in HTML will end up sitting in the player.config object, so your plugin will find player config options from there.  It will also be passed a **PluginConfig** object, which will contain any config options which start with its plugin id.  For example, this is how the *delicious* plugin could request its flashvars from the above embed code:

.. code-block:: actionscript

	public function initPlugin(player:IPlayer, pluginConfig:PluginConfig):void {
		var file:String = player.config.file;
	    var user:String = pluginConfig['user'];
	    var tags:String = pluginConfig['tags'];
	}


If you want to pull more complex data into the plugin, it is best to let the plugin itself load the data through an external XML file.  Keep in mind the Flash :ref:`Crossdomain security restrictions <crossdomain>`; the domain serving the XML needs a **crossdomain.xml** file that allows access from the domain from which the **player.swf** (NOT the plugin!) is served.

Building the Plugin
===================

We have a separate, short explanation on how to :ref:`compile your plugin <compilingplugins>` using the free, crossplatform Flex SDK. 

This page is made separate because it also explains how to compile any of the `open-source plugins we offer at this site <http://developer.longtailvideo.com/trac/wiki/WikiStart>`_.

Testing the Plugin
==================

For testing your plugin against various versions and setups of the player, you can use the `testing page <http://developer.longtailvideo.com/trac/testing>`_, which is part of the `plugin development SDK <http://developer.longtailvideo.com/trac/changeset/HEAD/sdks/fl5-plugin-sdk?old_path=/&format=zip>`_. Tests can be made against all versions of the player and with any combination of player/skin/plugins you'd like. Inserting your plugin in the testing page is simply a matter of changing the *settings.js* file that is included with the SDK. This is a dictionary that lists the location of all available plugins, skins, players and settings. It needs to know the location of your plugin SWF and the location of a plugin XML file, which describes your plugin. An example of such XML file is listed here, and more examples can be found in the `plugin development SDK <http://developer.longtailvideo.com/trac/changeset/HEAD/sdks/fl5-plugin-sdk?old_path=/&format=zip>`_.

.. code-block:: xml

	<plugin>
		<title>Plugin title</title>
		<filename>plugin.swf</filename>
		<version>1</version>
		<compatibility>Compatible with 5.0 and up</compatibility>
		<author>Me</author>
		<description>A short description of the plugin, in a few lines.</description>
		<href>http://www.mywebsite.com/plugins/myplugin/</href>
	
		<flashvars>
			<flashvar>
				<name>file</name>
				<default>myfile.xml</default>
				<description>A flashvar for this plugin</description>
			</flashvar>
			<flashvar>
				<name>image</name>
				<default></default>
				<description>Another flashvar, with no default value.</description>
			</flashvar>
		</flashvars>
	
	</plugin>



Debugging
=========

The player provides the ability for plugins to send debugging output via the `com.longtailvideo.jwplayer.utils.Logger <http://developer.longtailvideo.com/trac/browser/trunk/fl5/src/com/longtailvideo/jwplayer/utils/Logger.as>`_ class.  Include this class in your plugin and send a call to *Logger.log()* every time you want to log an event or error. The call takes a *message* and a *type* (which can be used to identify your plugin):

.. code-block:: actionscript

	Logger.log('XML file loaded and parsed','MyPlugin');

If you use `a debug version of the Adobe Flash player <http://kb2.adobe.com/cps/142/tn_14266.html>`_, you will have an additional rightclick menu item, saying "Logging to ...". The following options are available:

 * **none**: No logging is performed. This is the default.
 * **arthropod**: logs are sent to the `Arthropod AIR application <http://arthropod.stopp.se/>`_. It's a small, free and very useful tool.
 * **console**: logs are sent to the Firefox / Firebug console. 
 * **trace**: logs are sent to actionscript's built-in tracing command. You can `write these to a logfile <http://www.actionscript.org/resources/articles/207/1/Trace-and-debug-ActionScript-from-your-browser/Page1.html>`_ in turn.

If you want to debug with a non-debug player, set the flashvar *debug=xxx* in your embed code,  *xxx* being one of the above options. It is recommended you install a debug player though, since that enables you to also debug players whose flashvars you cannot alter.

Additional Technical Considerations
===================================

 * Since plugins are loaded as external SWFs, you'll need to keep in mind `Flash's Crossdomain security restrictions <http://developer.longtailvideo.com/trac/wiki/FlashSecurity>`_.
 * Another effect of externally loading SWF files is :ref:`how Flash handles class conflicts <classconflicts>`.  This is a must-read if you use any non-API player classes, or if you share classes across plugins.
 * Although Version 5.0 was written to be backwards-compatible with 4.x plugins, a number of plugin techniques are :ref:`no longer supported <deprecated>`.

Submiting your plugin
=====================

When you're done testing your plugin and would like to get people start using it, submit your plugin to the `LongTail Video Addons section <http://www.longtailvideo.com/addons/submitregister.html>`_. Once loaded onto LongTail's repository, your plugin can be loaded into any JW Player out there through the **plugins** option. Your plugins will instantly reach an audience of millions!

Good luck coding! And if you have any questions about building plugins, please visit the `LongTail Plugins Forum <http://www.longtailvideo.com/support/forums/addons/using-plugins>`_.