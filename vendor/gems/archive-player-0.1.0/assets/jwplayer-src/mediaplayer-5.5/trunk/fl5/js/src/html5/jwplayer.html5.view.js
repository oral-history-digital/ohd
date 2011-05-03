/**
 * JW Player view component
 *
 * @author zach
 * @version 5.4
 */
(function(jwplayer) {

	var _css = jwplayer.utils.css;
	
	jwplayer.html5.view = function(api, container, model) {
		var _api = api;
		var _container = container;
		var _model = model;
		var _wrapper;
		var _width;
		var _height;
		var _box;
		var _zIndex;
		var _resizeInterval;
		
		function createWrapper() {
			_wrapper = document.createElement("div");
			_wrapper.id = _container.id;
			_wrapper.className = _container.className;
			_container.id = _wrapper.id + "_video";
			
			_css(_wrapper, {
				position: "relative",
				height: _model.height,
				width: _model.width,
				padding: 0,
				backgroundColor: getBackgroundColor(),
				zIndex: 0
			});
			
			function getBackgroundColor() {
				if (_api.skin.getComponentSettings("display") && _api.skin.getComponentSettings("display").backgroundcolor) {
					return _api.skin.getComponentSettings("display").backgroundcolor;
				}
				return parseInt("000000", 16);
			}
			
			_css(_container, {
				position: "absolute",
				width: _model.width,
				height: _model.height,
				top: 0,
				left: 0,
				zIndex: 1,
				margin: "auto",
				display: "block"
			});
			
			jwplayer.utils.wrap(_container, _wrapper);
			
			_box = document.createElement("div");
			_box.id = _wrapper.id + "_displayarea";
			_wrapper.appendChild(_box);
		}
		
		function layoutComponents() {
			for (var pluginIndex = 0; pluginIndex < _model.plugins.order.length; pluginIndex++) {
				var pluginName = _model.plugins.order[pluginIndex];
				if (_model.plugins.object[pluginName].getDisplayElement !== undefined) {
					_model.plugins.object[pluginName].height = parseDimension(_model.plugins.object[pluginName].getDisplayElement().style.height);
					_model.plugins.object[pluginName].width = parseDimension(_model.plugins.object[pluginName].getDisplayElement().style.width);
					_model.plugins.config[pluginName].currentPosition = _model.plugins.config[pluginName].position;
				}
			}
			_loadedHandler();
		}
		
		function _loadedHandler(evt) {
			if (_model.getMedia() !== undefined) {
				for (var pluginIndex = 0; pluginIndex < _model.plugins.order.length; pluginIndex++) {
					var pluginName = _model.plugins.order[pluginIndex];
					if (_model.plugins.object[pluginName].getDisplayElement !== undefined) {
						if (_model.getMedia().hasChrome()) {
							_model.plugins.config[pluginName].currentPosition = jwplayer.html5.view.positions.NONE;
						} else {
							_model.plugins.config[pluginName].currentPosition = _model.plugins.config[pluginName].position;
						}
					}
				}
			}
			_resize(_model.width, _model.height);
		}
		
		function parseDimension(dimension) {
			if (typeof dimension == "string") {
				if (dimension === "") {
					return 0;
				} else if (dimension.lastIndexOf("%") > -1) {
					return dimension;
				} else {
					return parseInt(dimension.replace("px", ""), 10);
				}
			}
			return dimension;
		}
		
		this.setup = function(container) {
			_container = container;
			createWrapper();
			layoutComponents();
			_api.jwAddEventListener(jwplayer.api.events.JWPLAYER_MEDIA_LOADED, _loadedHandler);
			_api.jwAddEventListener(jwplayer.api.events.JWPLAYER_MEDIA_META, function() {
				_resizeMedia();
			});
			var oldresize;
			if (window.onresize !== null) {
				oldresize = window.onresize;
			}
			window.onresize = function(evt) {
				if (oldresize !== undefined) {
					try {
						oldresize(evt);
					} catch (err) {
					
					}
				}
				if (_api.jwGetFullscreen()) {
					var rect = document.body.getBoundingClientRect();
					_model.width = Math.abs(rect.left) + Math.abs(rect.right);
					_model.height = window.innerHeight;
				}
				_resize(_model.width, _model.height);
			};
		};
		
		function _keyHandler(evt) {
			switch (evt.keyCode) {
				case 27:
					if (_api.jwGetFullscreen()) {
						_api.jwSetFullscreen(false);
					}
					break;
				case 32:
					// For spacebar. Not sure what to do when there are multiple players
					if (_api.jwGetState() != jwplayer.api.events.state.IDLE && _api.jwGetState() != jwplayer.api.events.state.PAUSED) {
						_api.jwPause();
					} else {
						_api.jwPlay();
					}
					break;
			}
		}
		
		function _resize(width, height) {
			if (_wrapper.style.display == "none") {
				return;
			}
			var plugins = [].concat(_model.plugins.order);
			plugins.reverse();
			_zIndex = plugins.length + 2;
			if (!_model.fullscreen) {
				_model.width = width;
				_model.height = height;
				_width = width;
				_height = height;
				_css(_box, {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					width: width,
					height: height
				});
				_css(_wrapper, {
					height: _height,
					width: _width
				});
				var failed = _resizeComponents(_normalscreenComponentResizer, plugins);
				if (failed.length > 0) {
					_zIndex += failed.length;
					_resizeComponents(_overlayComponentResizer, failed, true);
				}
			} else {
				_resizeComponents(_fullscreenComponentResizer, plugins, true);
			}
			_resizeMedia();
		}
		
		function _resizeComponents(componentResizer, plugins, sizeToBox) {
			var failed = [];
			for (var pluginIndex = 0; pluginIndex < plugins.length; pluginIndex++) {
				var pluginName = plugins[pluginIndex];
				if (_model.plugins.object[pluginName].getDisplayElement !== undefined) {
					if (_model.plugins.config[pluginName].currentPosition.toUpperCase() !== jwplayer.html5.view.positions.NONE) {
						var style = componentResizer(pluginName, _zIndex--);
						if (!style) {
							failed.push(pluginName);
						} else {
							_model.plugins.object[pluginName].resize(style.width, style.height);
							if (sizeToBox) {
								delete style.width;
								delete style.height;
							}
							_css(_model.plugins.object[pluginName].getDisplayElement(), style);
						}
					} else {
						_css(_model.plugins.object[pluginName].getDisplayElement(), {
							display: "none"
						});
					}
				}
			}
			return failed;
		}
		
		function _normalscreenComponentResizer(pluginName, zIndex) {
			if (_model.plugins.object[pluginName].getDisplayElement !== undefined) {
				if (_hasPosition(_model.plugins.config[pluginName].position)) {
					if (_model.plugins.object[pluginName].getDisplayElement().parentNode === null) {
						_wrapper.appendChild(_model.plugins.object[pluginName].getDisplayElement());
					}
					var style = _getComponentPosition(pluginName);
					style.zIndex = zIndex;
					return style;
				}
			}
			return false;
		}
		
		function _overlayComponentResizer(pluginName, zIndex) {
			if (_model.plugins.object[pluginName].getDisplayElement().parentNode === null) {
				_box.appendChild(_model.plugins.object[pluginName].getDisplayElement());
			}
			var _iwidth = _model.width, _iheight = _model.height;
			if (typeof _model.width == "string" && _model.width.lastIndexOf("%") > -1) {
				percentage = parseFloat(_model.width.substring(0, _model.width.lastIndexOf("%"))) / 100;
				_iwidth = Math.round(window.innerWidth * percentage);
			}
			
			if (typeof _model.height == "string" && _model.height.lastIndexOf("%") > -1) {
				percentage = parseFloat(_model.height.substring(0, _model.height.lastIndexOf("%"))) / 100;
				_iheight = Math.round(window.innerHeight * percentage);
			}
			return {
				position: "absolute",
				width: (_iwidth - parseDimension(_box.style.left) - parseDimension(_box.style.right)),
				height: (_iheight - parseDimension(_box.style.top) - parseDimension(_box.style.bottom)),
				zIndex: zIndex
			};
		}
		
		function _fullscreenComponentResizer(pluginName, zIndex) {
			return {
				position: "fixed",
				width: _model.width,
				height: _model.height,
				zIndex: zIndex
			};
		}
		
		function _resizeMedia() {
			_box.style.position = "absolute";
			_model.getMedia().getDisplayElement().style.position = "absolute";
			if (_model.getMedia().getDisplayElement().videoWidth == 0 || _model.getMedia().getDisplayElement().videoHeight == 0) {
				return;
			}
			var iwidth, iheight;
			if (_box.style.width.toString().lastIndexOf("%") > -1 || _box.style.width.toString().lastIndexOf("%") > -1) {
				var rect = _box.getBoundingClientRect();
				iwidth = Math.abs(rect.left) + Math.abs(rect.right);
				iheight = Math.abs(rect.top) + Math.abs(rect.bottom);
			} else {
				iwidth = parseDimension(_box.style.width);
				iheight = parseDimension(_box.style.height);
			}
			jwplayer.utils.stretch(_api.jwGetStretching(), _model.getMedia().getDisplayElement(), iwidth, iheight, _model.getMedia().getDisplayElement().videoWidth, _model.getMedia().getDisplayElement().videoHeight);
		}
		
		function _getComponentPosition(pluginName) {
			var plugincss = {
				position: "absolute",
				margin: 0,
				padding: 0,
				top: null
			};
			var position = _model.plugins.config[pluginName].currentPosition.toLowerCase();
			switch (position.toUpperCase()) {
				case jwplayer.html5.view.positions.TOP:
					plugincss.top = parseDimension(_box.style.top);
					plugincss.left = parseDimension(_box.style.left);
					plugincss.width = _width - parseDimension(_box.style.left) - parseDimension(_box.style.right);
					plugincss.height = _model.plugins.object[pluginName].height;
					_box.style[position] = parseDimension(_box.style[position]) + _model.plugins.object[pluginName].height + "px";
					_box.style.height = parseDimension(_box.style.height) - plugincss.height + "px";
					break;
				case jwplayer.html5.view.positions.RIGHT:
					plugincss.top = parseDimension(_box.style.top);
					plugincss.right = parseDimension(_box.style.right);
					plugincss.width = plugincss.width = _model.plugins.object[pluginName].width;
					plugincss.height = _height - parseDimension(_box.style.top) - parseDimension(_box.style.bottom);
					_box.style[position] = parseDimension(_box.style[position]) + _model.plugins.object[pluginName].width + "px";
					_box.style.width = parseDimension(_box.style.width) - plugincss.width + "px";
					break;
				case jwplayer.html5.view.positions.BOTTOM:
					plugincss.bottom = parseDimension(_box.style.bottom);
					plugincss.left = parseDimension(_box.style.left);
					plugincss.width = _width - parseDimension(_box.style.left) - parseDimension(_box.style.right);
					plugincss.height = _model.plugins.object[pluginName].height;
					_box.style[position] = parseDimension(_box.style[position]) + _model.plugins.object[pluginName].height + "px";
					_box.style.height = parseDimension(_box.style.height) - plugincss.height + "px";
					break;
				case jwplayer.html5.view.positions.LEFT:
					plugincss.top = parseDimension(_box.style.top);
					plugincss.left = parseDimension(_box.style.left);
					plugincss.width = _model.plugins.object[pluginName].width;
					plugincss.height = _height - parseDimension(_box.style.top) - parseDimension(_box.style.bottom);
					_box.style[position] = parseDimension(_box.style[position]) + _model.plugins.object[pluginName].width + "px";
					_box.style.width = parseDimension(_box.style.width) - plugincss.width + "px";
					break;
				default:
					break;
			}
			return plugincss;
		}
		
		
		this.resize = _resize;
		
		this.fullscreen = function(state) {
			if (navigator.vendor.indexOf("Apple") === 0) {
				if (_model.getMedia().getDisplayElement().webkitSupportsFullscreen) {
					if (state) {
						_model.fullscreen = false;
						_model.getMedia().getDisplayElement().webkitEnterFullscreen();
					} else {
						_model.getMedia().getDisplayElement().webkitExitFullscreen();
					}
				} else {
					_model.fullscreen = false;
				}
			} else {
				if (state) {
					document.onkeydown = _keyHandler;
					clearInterval(_resizeInterval);
					var rect = document.body.getBoundingClientRect();
					_model.width = Math.abs(rect.left) + Math.abs(rect.right);
					_model.height = window.innerHeight;
					var style = {
						position: "fixed",
						width: "100%",
						height: "100%",
						top: 0,
						left: 0,
						zIndex: 2147483000
					};
					_css(_wrapper, style);
					style.zIndex = 1;
					_css(_model.getMedia().getDisplayElement(), style);
					style.zIndex = 2;
					_css(_box, style);
				} else {
					document.onkeydown = "";
					_model.width = _width;
					_model.height = _height;
					_css(_wrapper, {
						position: "relative",
						height: _model.height,
						width: _model.width,
						zIndex: 0
					});
				}
				_resize(_model.width, _model.height);
			}
		};
		
	};
	
	function _hasPosition(position) {
		return ([jwplayer.html5.view.positions.TOP, jwplayer.html5.view.positions.RIGHT, jwplayer.html5.view.positions.BOTTOM, jwplayer.html5.view.positions.LEFT].toString().indexOf(position.toUpperCase()) > -1);
	}
	
	jwplayer.html5.view.positions = {
		TOP: "TOP",
		RIGHT: "RIGHT",
		BOTTOM: "BOTTOM",
		LEFT: "LEFT",
		OVER: "OVER",
		NONE: "NONE"
	};
})(jwplayer);
