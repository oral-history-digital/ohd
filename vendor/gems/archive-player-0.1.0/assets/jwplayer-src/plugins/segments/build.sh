# This is a simple script that compiles the plugin using MXMLC (free & cross-platform).
# To use, make sure you have downloaded and installed the Flex SDK in the following directory:
FLEXPATH=/opt/flex


echo "Compiling with MXMLC..."
$FLEXPATH/bin/mxmlc ./com/jeroenwijering/plugins/Segments.as -sp ./ -o ./segments.swf -use-network=false