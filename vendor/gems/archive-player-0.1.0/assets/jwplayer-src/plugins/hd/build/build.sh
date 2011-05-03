# This is a simple script that compiles the plugin using MXMLC (free & cross-platform).
# To use, make sure you have downloaded and installed the Flex SDK in the following directory:
FLEXPATH=/opt/flex


echo "Compiling with MXMLC..."
#$FLEXPATH/bin/mxmlc ../src/com/longtailvideo/plugins/hd/HD.as -sp ../src -o ../hd.swf -library-path+=../libs -load-externs=../libs/sdk-classes.xml -use-network=false -optimize=true -incremental=false

$FLEXPATH/bin/mxmlc ../src/com/longtailvideo/plugins/hd/HD.as -sp ./../src -o ../hd.swf -library-path+=../../../lib -load-externs ../../../lib/jwplayer-5-classes.xml -use-network=false -static-link-runtime-shared-libraries=true
