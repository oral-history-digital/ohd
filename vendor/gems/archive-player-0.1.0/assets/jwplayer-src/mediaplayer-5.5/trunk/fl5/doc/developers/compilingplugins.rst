.. _compilingplugins:

=================
Compiling Plugins
=================

This page explains how to compile plugins using the `Adobe Flex SDK <http://www.adobe.com/cfusion/entitlement/index.cfm?e=flex3sdk>`_. With a combination of this free-for-download tool and a text editor of choice, anyone can build plugins for the JW Player. The Flex SDK is available for Linux, Mac OS X and Windows. The various `open-source plugins <http://developer.longtailvideo.com/trac/browser/plugins>`_ that we offer can also be modified and re-compiled using this tool.

.. note:: If you're looking to develop a plugin in order to serve ads in the JW Player, please `contact us <http://www.longtailvideo.com/about/contact-us>`_ beforehand. We have a special SDK for advertisers and advertising networks.

Installing the Flex SDK
=======================

The Flex SDK can be downloaded for free `from the Adobe site <http://www.adobe.com/cfusion/entitlement/index.cfm?e=flex3sdk>`_. The checkboxes and questions on this page are just for Adobe marketing purposes; they won't change the download. 

When the download has been completed, unzip the file and place the *flex_sdk_3* folder in your folder of choice (e.g. *Program Files* on Windows or *Applications* in Mac OS X). No more installation is needed.

Compiling a plugin
==================

Now let's test-compile a plugin. You can get a few basic plugins by `downloading the free Plugin SDK <http://developer.longtailvideo.com/trac/changeset/HEAD/sdks/fl5-plugin-sdk?old_path=/&format=zip>`_. Inside this Plugin SDK, you will find the source code of a few plugins. Each plugin source includes both a *build.bat* and a *build.sh* file. The first will compile the plugin on Windows, the latter will compile the plugin on Linux and Mac OS X.

To compile plugins, you'll also need `jwplayer-5-lib.swc, the Player API library <http://developer.longtailvideo.com/trac/export/sdks/fl5-plugin-sdk/lib/jwplayer-5-lib.swc>`_.  It's included in the plugin SDK, but if you're compiling your plugin without using the SDK, you'll have to download it separately and include it in your MXMLC library path.

Windows
-------

The *build.bat* file is used when you run Windows. Open the file in a text editor to check (and possibly change) the path to the Flex SDK on your computer. By default, it is *\Program Files\flex_sdk_3*. If the path is OK, you can double-click the *build.bat* file to compile the plugin. That's all!

Linux / Mac OS X
----------------

The *build.sh* file is used when you run Linux or Mac OS X. Open the file in a text editor to check (and possibly change) the path to the Flex SDK on your computer. By default, it is */Developer/SDKs/flex_sdk_3*. If the path is OK, you can open a Terminal window and insert the full path to the *build.sh* script to run it. Since sometimes the permissions of this build.sh file are not sufficient to run it, here is an example of what to insert in the terminal window to also set the permissions right:

.. code-block:: text

    cd ~/Desktop/sdks/fl5-plugin-sdk/plugins/player5plugin
    chmod 777 build.sh
    ./build.sh


That's it! Your plugin will now be built.

Note that the compiler will automatically stop and display compilation errors, should there be any in your source code. Use these error messages to find and fix the bugs.

Compiler Options
================

As you may have seen when opening *build.bat* or *build.sh* in the text editor, the actual compilation command is just one line of code:

.. code-block:: text

    %FLEXPATH%\bin\mxmlc .\Positioning.as -sp .\ -o .\positioning.swf -use-network=false


This command tells *mxmlc* (the compiler executive) which actionscript file to compile (*Positioning.as*). This file is the main class of the plugin. When the plugin is loaded into a player, this main class will be instantiated once. Next to the class to build, the compiler is also given a few options:

 * **-sp** (shorthand for **-source-path**): tells the compiler what the root directory of the actionscript code to compile is. Though the main actionscript file (*Positioning.as*) is directly handed  to the compiler, it should know how to resolve additional classes linked from this main class. For example, if the main class imports a *com.longtailvideo.jwplayer.plugins.IPlugin*, the compiler knows that it can find the actionscript file at *.\com\longtailvideo\jwplayer\plugins\IPlugin.as*.
 * **-o** (shorthand for **-output**): tells the compiler where to write the resulting SWF file. In this case (*.\positioning.swf*) in the same directory as the build script itself.
 * **-use-network**: tells the compiler that the SWF either can (*true*) or cannot (*false*) access files from the internet when running locally. When  set to *true*, the SWF cannot load any local files anymore though. Since a lot of people test their plugins locally, we have this option turned *false*. Note that, if the SWF is served from a webserver, it can still load files from the internet.

The options listed above are sufficient to compile working plugins. The compiler supports a `large number of options <http://flexstuff.googlepages.com/FlexCompilerOptions.html>`_ though, most of them are for more advanced compilation workflows or metadata insertion.

Compiling with Flash CS4
========================


As with the 4.x player, compiling plugins using Flash CS4 is still supported.  Here's what you'll need to do to compile your plugin in Flash CS4:

To compile this plugin in Flash CS4, you'll need to follow these steps:
 1. Copy-paste the above code in a new textfile called Helloworld.as. 
 2. Next, create a new FLA file (with Actionscript 3.0 / Flash Player 9 support), save it, and set its *Document class* property to point to your new .as class.  (But without the ".as" extension - i.e. "Helloworld").
 3. Download `the Player API library <http://developer.longtailvideo.com/trac/export/HEAD/sdks/fl5-plugin-sdk/lib/jwplayer-5-lib.swc>`_.
 4. Under the "File" menu, select "Publish Settings", then click the "Settings..." button next to the "Script" drop-down menu.
 5. Select the "Library path" tab, then click the "Add new path" (+) button, and browse to the jwplayer-5-lib.swc file.
 6. Click the "OK" button to exit the compiler settings menu, then click the "Publish" button.

Your pugin swf should appear in the same location as your FLA file.

Submit Your Plugin
==================


If you have built your own plugin and are happy happy with the way it works, you can `submit it to LongTail Video <http://www.longtailvideo.com/addons/submitregister.html>`_. We'll do a quick sanity check of your plugin and then list it in `our AddOns section <http://www.longtailvideo.com/addons/>`_. You can also ask for donations of your plugin through our site to make some money. For more info about that, please `contact us <http://www.longtailvideo.com/support/contact-us>`_.