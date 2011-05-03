.. _embed:

Embedding the player
====================

Like every other Flash object, the JW Player has to be embedded into the HTML of a webpage using specific embed codes. Overall, there are two methods for embedding Flash: 

* Using a javascript (like `SWFObject <http://code.google.com/p/swfobject/>`_).
* Using a HTML tag (like *<embed>*).

We highly recommend the javascript method for Flash embedding. It can sniff if a browsers supports Flash, it ensures the player :ref:`api` works and it avoids browser compatibility issues. Detailed instructions can be found below.


Upload
------

First, a primer on uploading. This may sound obvious, but for the JW Player to work on your website, you must upload the *player.swf* file from the download (or SVN checkout) to your webserver. If you want to play Youtube videos, you must also upload the **yt.swf** file - this is the bridge between the player and Youtube. No other files are needed.

Your :ref:`media files <media>` and :ref:`playlists <playlists>` can be hosted at any domain. Do note that :ref:`crossdomain` apply when loading these files from a different domain. In short, playing media files works, but loading playlists across domains will not work by default. Resolve this issue by hosting a :ref:`crossdomain.xml file <crossdomain>`.


SWFObject
---------

The preferred way to embed the JW Player on a webpage is javascript. There's a wide array of good, open source libraries available for doing so. We recommend **SWFObject**, the most widely used one. It has `excellent documentation <http://code.google.com/p/swfobject/wiki/documentation>`_.

Before embedding any players on the page, make sure to include the *swfobject.js* script in the *<head>* of your HTML. You can download the script and host it yourself, or leverage the copy `provided by Google <http://code.google.com/apis/ajaxlibs/documentation/>`_:

.. code-block:: html

   <script type="text/javascript" 
     src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js">
   </script>

With the library set up, you can start embedding players. Here's an example:

.. code-block:: html

   <p id="container1">You don't have Flash ...</p>

   <script type="text/javascript">
     var flashvars = { file:'/data/bbb.mp4',autostart:'true' };
     var params = { allowfullscreen:'true', allowscriptaccess:'always' };
     var attributes = { id:'player1', name:'player1' };

     swfobject.embedSWF('player.swf','container1','480','270','9.0.115','false',
       flashvars, params, attributes);
   </script>

It's a fairly sizeable chunk of code that contains the embed *container*, *flashvars*, *params*, *attributes* and *instantiation*. Let's walk through them one by one:

* The *container* is the HTML element where the player will be placed into. It should be a block-level element, like a <p> or <div>. If a user has a sufficient version of Flash, the text inside the container is removed and replaced by the videoplayer. Otherwise, the contents of the container will remain visible.
* The *flashvars* object lists your player :ref:`options`. One option that should always be there is *file*, which points to the file to play. You can insert as many options as you want.
* The *params* object includes the `Flash plugin parameters <http://kb2.adobe.com/cps/127/tn_12701.html>`_. The two parameters in the example (our recommendation) enable both the *fullscreen* and *javascript* functionality of Flash.
* The *attributes* object include the HTML attributes of the player. We recommend always (and only) setting an *id* and *name*, to the same value. This will be the *id* of the player instance if you use its :ref:`api`.
* The *instantiation* is where all things come together and the actual player embedding takes place. These are all parameters of the SWFObject call:

   * The URL of the *player.swf*, relative to the page URL.
   * The ID of the container you want to embed the player into.
   * The width of the player, in pixels. Note the JW Player automatically stretches itself to fit.
   * The height of the player, in pixels. Note the JW Player automatically stretches itself to fit.
   * The required version of Flash. We highly recommend setting *9.0.115*. This is the first version that supports :ref:`MP4 <media>` and is currently installed at >95% of all computers. The only feature for which you might restricted to *10.0.0* is :ref:`RTMP dynamic streaming <rtmp>`.
   * The location of a Flash auto-upgrade script. We recommend to **not** use it. People that do not have Flash 9.0.115 either do not want or are not able (no admin rights) to upgrade.
   * Next, the *flashvars*, *params* and *attributes* are passed, in that order.


It is no problem to embed multiple players on a page. However, make sure to give each player instance a different container **id** and a different attributess **id** and **name**.


Embed tag
---------

In cases where a javascript embed method is not possible (e.g. if your CMS does not allow including javascripts), the player can be embedded using plain HTML. There are various combinations of tags for embedding a SWF player:

* A single *<embed>* tag (for IE + other browsers).
* An *<object>* tag with nested *<embed>* tag (the first one for IE, the second for other browsers).
* An *<object>* tag with nested *<object>* tag (the first one for IE, the second for other browsers).

We recommend using the single *<embed>* tag. This works in all current-day browsers (including IE6) and provides the shortest codes. Here is an example embed code that does exactly the same as the SWFObject example above:

.. code-block:: html

   <embed
     flashvars="file=/data/bbb.mp4&autostart=true"
     allowfullscreen="true"
     allowscripaccess="always"
     id="player1"
     name="player1"
     src="player.swf" 
     width="480"
     height="270"
   />

As you can see, most of the data of the SWFObject embed is also in here:

* The **container** is now the embed tag itself. The *fallback* text cannot be used anymore.
* The **flashvars** are merged into a single string, and loaded as an attribute. You should always concatenate the flashvars using so-called querystring parameter encoding: *flashvar1=value1&flashvar2=value2&...*.
* The **params** each are individual attributes of the embed tag.
* The **attributes** also are individual attributes of the embed tag.
* The **instantiation** options (source, width, height) are attributes of the embed tag. 

.. note:: 

   As you can see, the Flash version reference is not in the embed tag: this is one of the drawbacks of this method: it's not possible to sniff for Flash and selectively hide it, e.g. if the flash version is not sufficient or if the device (iPad ...) doesn't support Flash.
