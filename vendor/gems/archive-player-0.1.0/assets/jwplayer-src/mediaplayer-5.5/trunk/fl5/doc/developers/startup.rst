.. _startup:

Player Startup Phase
====================

When the Player is loaded by the browser, it completes the following steps before allowing the user to begin playback.  During this time, a loading screen is displayed.

 1. Load Config:
 Loads the Player's configuration.  This may be accomplished by setting [wiki:FlashVars FlashVars], or by loading the Config XML file specified by the **config** FlashVar.

 2. Load Skin:
 Depends on **1**.  The Player loads its skin.  If the **skin** FlashVar is set, the player will load the skin from the provided URL.  Otherwise, it loads its embedded skin.

 3. Load Plugins:
 Depends on **1**.  If the **plugins** FlashVar is set, the player will load them from *plugins.longtailvideo.com*.

 4. Load Playlist:
 Depends on **1**.  If the **playlistfile** FlashVar is set, the provided XML Playlist is loaded and parsed.

 5. Initialize Plugins:
 Depends on **2, 3, 4**.  The plugins' **initPlugin()** method is called.  The plugins have the opportunity to lock the player at this point.

 6. JavaScript CallBacks:
 Depends on **5**.  Once the plugins are initialized, and after all plugins have released their locks, the JavaScript method called for by the **playerready** FlashVar is executed.

 7. Begin Playback if Autostart:
 Depends on **5, 6**.  When plugins have been loaded, and the JavaScript **playerready** callback has been executed, the player can begin playback.  If the **autostart** FlashVar is set, playback begins immediately.  Otherwise, the player's loading screen fades out, and the user interface controls are displayed.

 8. Load MediaProviders:
 Depends on **7**.  If the playlist contains any files that require external MediaProviders, they are loaded and initialized before the first playlist item that requires them is played.