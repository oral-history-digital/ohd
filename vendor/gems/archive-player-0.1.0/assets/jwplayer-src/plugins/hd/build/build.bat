:: This is a simple script that compiles the plugin using the free Flex SDK on Windows.
:: Learn more at http://developer.longtailvideo.com/trac/wiki/PluginsCompiling

SET FLEXPATH="C:\Program Files (x86)\Adobe\Adobe Flash Builder Beta 2\sdks\3.4.1"

echo "Compiling player 5 plugin..."

%FLEXPATH%\bin\mxmlc ..\src\com\longtailvideo\plugins\hd\HD.as -sp ..\src\ -o ..\hd.swf -library-path+=..\libs -load-externs ..\libs\sdk-classes.xml  -use-network=false -debug=false