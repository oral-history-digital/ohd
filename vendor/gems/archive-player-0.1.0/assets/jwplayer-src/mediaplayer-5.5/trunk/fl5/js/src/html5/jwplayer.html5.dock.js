/**
 * JW Player dock component
 */
(function(jwplayer) {
	jwplayer.html5.dock = function(api, config) {
		// TODO: Config parser needs to move dock to dock.align
		function _defaults() {
			return {
				align: jwplayer.html5.view.positions.RIGHT
			};
		};
		
		var _config = jwplayer.utils.extend({}, _defaults(), config);
		
		var _buttons = {};
		var _buttonArray = [];
		var _width;
		var _height;
		
		var _dock = document.createElement("div");
		_dock.id = api.id + "_jwplayer_dock";
		
		this.getDisplayElement = function() {
			return _dock;
		};
		
		this.setButton = function(id, handler, outGraphic, overGraphic) {
			if (!handler && _buttons[id]) {
				jwplayer.utils.arrays.remove(_buttonArray, id);
				_dock.removeChild(_buttons[id].div);
				delete _buttons[id];
			} else {
				var div;
				if (!_buttons[id]) {
					_buttonArray.push(id);
					div = document.createElement("div");
					div.style.position = "absolute";
					_dock.appendChild(div);
					
					div.appendChild(document.createElement("img"));
					div.childNodes[0].style.position = "absolute";
					div.childNodes[0].style.left = 0;
					div.childNodes[0].style.top = 0;
					div.childNodes[0].style.zIndex = 10;
					
					div.appendChild(document.createElement("img"));
					div.childNodes[1].style.display = "none";
					div.childNodes[1].style.position = "absolute";
					div.childNodes[1].style.left = 0;
					div.childNodes[1].style.top = 0;
					div.childNodes[1].style.zIndex = 9;
					
					div.appendChild(document.createElement("img"));
					div.childNodes[2].style.position = "absolute";
					div.childNodes[2].style.left = 0;
					div.childNodes[2].style.top = 0;
					if (api.skin.getSkinElement("dock", "button")) {
						div.childNodes[2].src = api.skin.getSkinElement("dock", "button").src;
					}
					div.childNodes[2].style.zIndex = 8;
					
					div.appendChild(document.createElement("img"));
					div.childNodes[3].style.display = "none";
					div.childNodes[3].style.position = "absolute";
					div.childNodes[3].style.left = 0;
					div.childNodes[3].style.top = 0;
					div.childNodes[3].style.display = "none";
					div.childNodes[3].style.zIndex = 7;
					if (api.skin.getSkinElement("dock", "buttonOver")) {
						div.childNodes[3].src = api.skin.getSkinElement("dock", "buttonOver").src;
					}
					
					div.onmouseover = function() {
						div.childNodes[0].style.display = "none";
						div.childNodes[1].style.display = "block";
						if (api.skin.getSkinElement("dock", "buttonOver")) {
							div.childNodes[2].style.display = "none";
							div.childNodes[3].style.display = "block";
						}
					}
					
					div.onmouseout = function() {
						div.childNodes[0].style.display = "block";
						div.childNodes[1].style.display = "none";
						if (api.skin.getSkinElement("dock", "buttonOver")) {
							div.childNodes[2].style.display = "block";
							div.childNodes[3].style.display = "none";
						}
					}
				}
				if (!div) {
					div = _buttons[id].div;
				}
				if (handler) {
					div.onclick = function(evt) {
						evt.preventDefault();
						if (typeof handler == "string") {
							window[handler]();
							return;
						}
						handler();
					}
				}
				if (outGraphic) {
					div.childNodes[0].src = outGraphic;
					div.childNodes[0].style.display = "block";
				}
				if (overGraphic) {
					div.childNodes[1].style.display = "none";
					div.childNodes[1].src = overGraphic;
				}
				_buttons[id] = {
					handler: handler,
					outGraphic: outGraphic,
					overGraphic: overGraphic,
					div: div
				}
			}
			
			_resize(_width, _height);
		}
		
		function _resize(width, height) {
			_width = width;
			_height = height;
			
			if (_buttonArray.length > 0) {
				var margin = 10;
				var xStart = width - _buttons[_buttonArray[0]].div.getBoundingClientRect().width - margin;
				var usedHeight = margin;
				var direction = -1;
				if (_config.align == 'left') {
					direction = 1;
					xStart = margin;
				}
				for (var i = 0; i < _buttonArray.length; i++) {
					var row = Math.floor(usedHeight / height);
					if ((usedHeight + _buttons[_buttonArray[i]].div.getBoundingClientRect().height + margin) > ((row + 1) * height)) {
						usedHeight = ((row + 1) * height) + margin;
						row = Math.floor(usedHeight / height);
					}
					_buttons[_buttonArray[i]].div.style.top = (usedHeight % height) + "px";
					_buttons[_buttonArray[i]].div.style.left = (xStart + (_buttons[_buttonArray[i]].div.getBoundingClientRect().width + margin) * row * direction) + "px";
					;
					usedHeight += _buttons[_buttonArray[i]].div.getBoundingClientRect().height + margin;
				}
			}
		}
		
		this.resize = _resize;
		
		return this;
	}
})(jwplayer);
