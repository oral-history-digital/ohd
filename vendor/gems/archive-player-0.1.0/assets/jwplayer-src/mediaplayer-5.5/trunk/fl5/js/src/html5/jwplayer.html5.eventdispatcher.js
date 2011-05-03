/**
 * Event dispatcher for the JW Player for HTML5
 *
 * @author zach
 * @version 5.4
 */
(function(jwplayer) {
	jwplayer.html5.eventdispatcher = function(id, debug) {
		var _id = id;
		var _debug = debug;
		var _listeners;
		var _globallisteners;
		
		/** Clears all event listeners **/
		this.resetEventListeners = function() {
			_listeners = {};
			_globallisteners = [];
		};
		
		this.resetEventListeners();
		
		/** Add an event listener for a specific type of event. **/
		this.addEventListener = function(type, listener, count) {
			try {
				if (_listeners[type] === undefined) {
					_listeners[type] = [];
				}
				
				if (typeof(listener) == "string") {
					eval("listener = " + listener);
				}
				_listeners[type].push({
					listener: listener,
					count: count
				});
			} catch (err) {
				jwplayer.utils.log("error", err);
			}
			return false;
		};
		
		
		/** Remove an event listener for a specific type of event. **/
		this.removeEventListener = function(type, listener) {
			try {
				for (var listenerIndex = 0; listenerIndex < _listeners[type].length; listenerIndex++) {
					if (_listeners[type][lisenterIndex].toString() == listener.toString()) {
						_listeners[type].slice(lisenterIndex, lisenterIndex + 1);
						break;
					}
				}
			} catch (err) {
				jwplayer.utils.log("error", err);
			}
			return false;
		};
		
		/** Add an event listener for all events. **/
		this.addGlobalListener = function(listener, count) {
			try {
				if (typeof(listener) == "string") {
					eval("listener = " + listener);
				}
				_globallisteners.push({
					listener: listener,
					count: count
				});
			} catch (err) {
				jwplayer.utils.log("error", err);
			}
			return false;
		};
		
		/** Add an event listener for all events. **/
		this.removeGlobalListener = function(listener) {
			try {
				for (var globalListenerIndex = 0; globalListenerIndex < _globallisteners.length; globalListenerIndex++) {
					if (_globallisteners[globalListenerIndex].toString() == listener.toString()) {
						_globallisteners.slice(globalListenerIndex, globalListenerIndex + 1);
						break;
					}
				}
			} catch (err) {
				jwplayer.utils.log("error", err);
			}
			return false;
		};
		
		
		/** Send an event **/
		this.sendEvent = function(type, data) {
			if (data === undefined) {
				data = {};
			}
			jwplayer.utils.extend(data, {
				id: _id,
				version: jwplayer.version,
				type: type
			});
			if (_debug) {
				jwplayer.utils.log(type, data);
			}
			if (typeof _listeners[type] != "undefined") {
				for (var listenerIndex = 0; listenerIndex < _listeners[type].length; listenerIndex++) {
					try {
						_listeners[type][listenerIndex].listener(data);
					} catch (err) {
						jwplayer.utils.log("There was an error while handling a listener", _listeners[type][listenerIndex].listener, err);
					}
					if (_listeners[type][listenerIndex].count === 1) {
						delete _listeners[type][listenerIndex];
					} else if (_listeners[type][listenerIndex].count > 0) {
						_listeners[type][listenerIndex].count = _listeners[type][listenerIndex].count - 1;
					}
				}
			}
			for (var globalListenerIndex = 0; globalListenerIndex < _globallisteners.length; globalListenerIndex++) {
				try {
					_globallisteners[globalListenerIndex].listener(data);
				} catch (err) {
					jwplayer.utils.log("There was an error while handling a listener", _globallisteners[globalListenerIndex].listener, err);
				}
				if (_globallisteners[globalListenerIndex].count === 1) {
					delete _globallisteners[globalListenerIndex];
				} else if (_globallisteners[globalListenerIndex].count > 0) {
					_globallisteners[globalListenerIndex].count = _globallisteners[globalListenerIndex].count - 1;
				}
			}
		};
	};
})(jwplayer);
