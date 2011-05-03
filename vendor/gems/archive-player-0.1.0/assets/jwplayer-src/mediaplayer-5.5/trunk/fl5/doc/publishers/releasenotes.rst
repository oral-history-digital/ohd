.. _releasenotes:

=============
Release Notes
=============

Version 5.4
===========

Build 1492
----------

JW Embedder
+++++++++++
 * Fixes an issue where playlist items with no file extension or file extensions not in the extension map failed over to the download link.

Build 1479
----------

JW Embedder
+++++++++++
 * Embedder now offers download link when no playback mechanism is available.
 * Fixed a bug where the remove() call did not work in Firefox
 * Fixed a bug where configuration was not passed to plugins with non-CDNed paths.

Flash Mode
++++++++++
 * Added support for netstreambasepath configuration parameter
 * Seek calls are now queued if they are made while the player is not yet playing.
 * Logger now performs all logging inside of a try / catch
 * Fixed an issue where 
 * Updated API events for consistency across players
 
HTML5 Mode
++++++++++
 * Stretching mode configuration is honored
 * Fixes an issue where the player would fail to initialize when some popular JavaScript libraries (including Mootools and ProtoType) were loaded on the page.
 * Seek calls are now queued if they are made while the player is not yet playing.
 * Fixed an issue where the controlbar would render under browser scrollbars
 * Fixed an issue where playlists on iOS did not auto-advance
 * Fixed several issue related to skin loading, where the result of the file request was not XML or was a redirect.
 * Updated watermark behavior to mirror that of Flash player
 * Updated API events for consistency across players
 
API
+++
 * Updated API events for consistency across players
 * Added item parameter to getPlaylistItem()
 
A full changelog of Flash player updates can be found `here <http://developer.longtailvideo.com/trac/query?status=assigned&status=closed&status=new&status=reopened&group=type&order=type&col=id&col=summary&milestone=Player+5.4&resolution=fixed>`_

Version 5.3
===========

Build 1397
----------

JW Embedder
+++++++++++

* Embedder now fails over to Flash if the first playlist item is unplayable in HTML5
* Fixes an issue where configuring a "levels" block would override the "providers" setting 
* Sets the "wmode" Flash parameter to "opaque"
* Fixes the getPlaylistItem() API call to return the currently playing item, instead of the first playlist item

Flash Mode
++++++++++

* Fixed an issue which could cause RTMP streams to fail if RTMPT was disabled
* Removed logic which disabled playlist thumbnails when the playlist was smaller than 240 pixels

HTML5 Mode
++++++++++

* Fixes an issue which could add an additional slash in relative URLs for loaded files


Build 1356
----------

New Features
++++++++++++

* Included framedrop handling for both HTTP and RTMP streaming, allowing switches in case of insufficient client resources (e.g. a netbook attempting to play an HD stream.)
* Automatic fallback to Tunneled RTMP / RTMPe (in case regular RTMP is blocked).
* RTMP dynamic streaming can now be setup together with loadbalancing (using a SMIL XML file).
* RTMP DVR now using Adobe's official DVRCast application instead of a custom serverside script.
* Support for HTTP DVR streaming as offered by the Bitgravity CDN.
* With PNG skinning, the description and image of playlist buttons are automatically hidden when the playlistbutton is less than 40px high and/or less than 240px wide.
* Supports browser-based video playback via HTML5's <video> tag as either the primary or failover playback mechanism. (See HTML5 Beta Player Integration)
* Updated JavaScript API to more closely match the Flash API.
* Included JS library offers a new embed mechanism.
* Player automatic embeds over <video> tags with class "jwplayer".

Bug Fixes
+++++++++

* Fixed a bug that caused current bandwidth not to store in a cookie, resulting in continous bitrate switching after 2 seconds.
* Fixed a bug that caused the duration textfield of a playlistitem would not be placed to the right.
* Fixed a bug that caused PNG skin playlists not to show the item.png on rollout if there was no itemActive.
* Fixed a bug that prevented the thumbnail image to be displayed while playing audio-only RTMP streams or AAC files
* Fixed a bug that interfered with URL-encoded URIs
* Fixed audio file handling for live mp3 streams and other servers without content-length headers
* Fixed a bug in event ordering for the JavaScript API
* Fixed an issue preventing the controlbar buffer indicator from being displayed until after buffering was complete
* Fixed an intermittent issue with YouTube videos being cut off before the video is complete

A full changelog of Flash player updates can be found `here <http://developer.longtailvideo.com/trac/query?status=assigned&status=closed&status=new&status=reopened&group=type&order=type&col=id&col=summary&milestone=Flash+5.3&resolution=fixed>`_


HTML5 Beta Player Integration
+++++++++++++++++++++++++++++
The JW Player for HTML5 Beta was originally a separate player project, but it has been merged into the primary player. The changes made to incorporate the two are listed below:

Restructuring
~~~~~~~~~~~~~
* API was changed to match the Flash Player.
* Flash embedding logic was moved into JW Embedder.
* Support for IE is deprecated.

Features
~~~~~~~~
* Removed all jQuery dependencies.
* Added playlist support.
* Added fullscreen support.
* Added default skin.
* Buffer icon rotates.
* YouTube videos now play by embedding the YouTube player.
 
Enhancements
~~~~~~~~~~~~
* Increased stability and performance across all platforms.
* Flash and HTML5 player implement unified API.
* UI components (controlbar, display, logo) now support all skinning configuration options.

Bugs
~~~~
* Fixed issue where certain DOCTYPEs would cause the player to render incorrectly.
* Fixed issue where call to load did not load new media.
* Fixed several iOS device issues (iPad zoom + seek, replay failed) by moving over to native controls.
* Fixed issue where certain browsers would display double controlbars
* Player now detects a wide variety of file extensions and adds the correct type to the <source> tag.

Version 5.2
===========

Build 1151
----------

Bug Fixes
+++++++++

 * Fixes problem initializing externally-loaded MediaProviders
 * Fixes minor issue sending sound metadata events to javascript 
 * Support for an alternate YouTube URL scheme (http://www.youtube.com/v/{video_id})
 * Fixes black-on-black error messages in FireFox with Flash 10.1 

Other Changes
+++++++++++++

 * Replaces encryption logic for Wowza secure token with Wowza's own class
 * Pre-loading error screen now displays error message instead of simply showing an error icon
 

Build 1065
----------

New Features
++++++++++++

Version 5.2 introduces a number of new features to the XML/PNG skinning model.

* Support for customized font settings (face, weight, style, color) in controlbar and playlist text fields.
* Ability to set custom *backgroundcolor* for each element.
* Ability to set custom *overcolor* and *activecolor* for playlist items.

   These colorization settings replace the generic *backcolor*, *frontcolor*, *lightcolor* and *screencolor* :ref:`options <options>`, allowing for more fine-grained control.

* Customized controlbar layout:

  * Allows placement of any button, text field or slider available in the controlbar
  * Adds the ability to insert arbitrary divider images
  * Adds the ability to insert arbitrary *spacer* elements

* New skinning elements:

   * Left and right end caps for time and volume sliders (*timeSliderCapLeft*, *timeSliderCapRight*, *volumeSliderCapLeft*, *volumeSliderCapRight*)
   * Active state for playlist item background (*itemActive* element)
   * Image placeholder for playlist item images (*itemImage* element)
   * Top and bottom end caps for playlist slider (*sliderCapTop*, *sliderCapBottom*)
   * Background images for text fields (*elapsedBackground*, *durationBackground*)
   * Over states for display icons (*playIconOver*, *muteIconOver*, *bufferIconOver*)

* Ability to control rate and amount of display *bufferIcon* rotation.
* Ability to use SWF assets in addition to JPGs and PNGs in XML skinning

An in-depth walkthrough of all new skinning features can be found in the :ref:`XML/PNG Skinning Guide <skinning>`.

Bug Fixes
+++++++++

 * Allows YouTube videos to be embedded in HTTPS pages
 * Makes the YouTube logo clickable
 * Fixes an issue where some dynamic streams only switch on resize events
 * Fixes an issue which would cause dynamically switched RTMP livestreams to close early
 * No longer hides the the display image when playing AAC or M4A audio files
 * Allows querystring parameters for .flv files streamed over RTMP. This fixes a problem some Amazon CloudFront users were having with private content.


Version 5.1
===========

Build 897
---------

Bug Fixes
+++++++++

 * Fixed an issue where load-balanced RTMP streams with bitrate switching could cause an error
 * Fixed buffer icon centering and rotation for v5 skins

Build 854
---------

New Features
++++++++++++

 * Since 5.0 branched off from 4.5, version 5.1 re-integrates changes from 4.6+ into the 5.x branch, including:
 
  * Bitrate Switching
  * Bandwidth detection
  
 * DVR functionality for [wiki:FlashMediaServerDVR RTMP live streams].

Major Bug Fixes
+++++++++++++++

 * Allows loading images from across domains without :ref:`security restrictions <crossdomain>`.
 * Fixes some RTMP live/recorded streaming issues
 * Fixes an issue where the *volume* flashvar is not respected when using RTMP
 * Fixes issue where adjusting volume for YouTube videos doesn't work in Internet Explorer
 * Various JavaScript API fixes
 * Various visual tweaks
 * Brings back icons=false functionality
 * Brings back *id* flashvar, for Linux compatibility
 * Better support of loadbalancing using the SMIL format

A full changelog can be found `here <http://developer.longtailvideo.com/trac/query?group=status&milestone=Flash+5.1&order=type>`_

Version 5.0
===========

Build 753
---------

Features new to 5.0
+++++++++++++++++++

 * Bitmap Skinning (PNG, JPG, GIF)
 * API Update for V5 plugins
 
  * Player resizes plugins when needed
  * Player sets X/Y coordinates of plugins
  * Plugins can request that the player block (stop playback) or lock (disable player controls).
  
 * MXMLC can be used to [browser:/trunk/fl5/README.txt compile the player].
 * Backwards compatibility
 
  * SWF Skins
  * Version 4.x plugins
  * Version 4.x JavaScript

4.x features not available in 5.0
+++++++++++++++++++++++++++++++++

 * Bitrate switching, introduced in 4.6
 * *displayclick* flashvar
 * *logo* flashvar (for non-commercial players)
 * *link* flashvar
 
A full changelog can be found [/query?group=status&milestone=Flash+5.0&order=type here]
