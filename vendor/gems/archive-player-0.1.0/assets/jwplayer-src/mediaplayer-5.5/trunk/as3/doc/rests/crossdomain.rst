.. _crossdomain:

Crossdomain Security Restrictions
=================================

The Adobe Flash Player contains a `crossdomain security mechanism <http://www.adobe.com/devnet/flashplayer/security.html>`_, similar to JavaScript's `Cross-Site Scripting <http://en.wikipedia.org/wiki/Cross-site_scripting>`_ restrictions. Flash's security model denies certain operations on files that are loaded from a different domain than the *player.swf*. Roughly speaking, three basic operations are denied:

 * Loading of data files (such as :ref:`playlists` and the :ref:`config XML <options>`).
 * Loading of SWF files (such as :ref:`skins <intro>`).
 * Accessing raw data of media files (such as :ref:`ID3 metadata <api>`, sound waveform data or image bitmap data).

Generally, file loads (XML or SWF) will fail if there's no crossdomain access. Attempts to access or manipulate data (ID3, waveforms, bitmaps) will abort. 

Crossdomain XML
---------------

Crossdomain security restrictions can be lifted by hosting a `crossdomain.xml file <http://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html>`_ on the server that contains the files. This file must be placed in the root of your (sub)domain, for example:

.. code-block:: text

   http://www.myserver.com/crossdomain.xml
   http://videos.myserver.com/crossdomain.xml


Before the Flash Player attempts to load XML files, SWF files or raw data from any domain other than the one hosting the *player.swf*, it checks the remote site for the existence of such a *crossdomain.xml* file. If Flash finds it, and if the configuration permits external access of its data, then the data is loaded. The file is not loaded or the data is not shown. 

Allow All Example
^^^^^^^^^^^^^^^^^

Here’s an example of a *crossdomain.xml* that allows access to the domain's data from SWF files on any site:

.. code-block:: xml

   <?xml version="1.0"?>
   <!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
   <cross-domain-policy>
     <allow-access-from domain="*" />
   </cross-domain-policy>


Our *plugins.longtailvideo.com* domain includes `such a crossdomain file <http://plugins.longtailvideo.com/crossdomain.xml>`_, so players from any domain cal load the plugins hosted there. 

Note that this example sets your server wide open. Any SWF file can load any data from your site, which might lead to sercurity issues.


Restrict Access Example
^^^^^^^^^^^^^^^^^^^^^^^

Here is another example *crossdomain.xml*, this time permitting SWF file access from only a number of domains:

.. code-block:: xml

   <?xml version="1.0"?>
   <!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
   <cross-domain-policy>
     <allow-access-from domain="*.domain1.com"/>
     <allow-access-from domain="www.domain2.com"/>
   </cross-domain-policy>

Note the use of the wildcard symbol: any subdomain from *domain1* can load data, whereas *domain2* is restricted to only the  *www* subdomain.

Crossdomain policy files can even further finegrain access, e.g. to certain ports or HTTP headers. For a detailed overview, see `Adobe's Crossdomain documentation <http://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html>`_.