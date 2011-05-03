package com.longtailvideo.jwplayer.view.components {


    import flash.display.*;
    import flash.events.*;
    import flash.external.ExternalInterface;
    import flash.net.URLRequest;


    /** A button from within the dock added from javascript. **/
    public class DockJSButton extends ComponentButton {


        /** Javascript click handler. **/
        private var _click:String;
        private var _overLoader:Loader;
        private var _outLoader:Loader;


        /** Constructor **/
        public function DockJSButton(name:String, back:DisplayObject, tab:Number):void {
            this.name = name;
            setBackground(back);
			this.tabEnabled = true;
			this.tabChildren = false;
			this.tabIndex = tab;
			this.buttonMode = true;
			_outLoader = new Loader();
            _outLoader.contentLoaderInfo.addEventListener(Event.COMPLETE,_loadOutHandler);
			_overLoader = new Loader();
            _overLoader.contentLoaderInfo.addEventListener(Event.COMPLETE,_loadOverHandler);
        };


        /** Load the out icon. **/
        public function loadOutIcon(url:String):void {
            _outLoader.load(new URLRequest(url));
        };


        /** Set the out icon when loaded. **/
        private function _loadOutHandler(event:Event):void {
            setOutIcon(_outLoader);
            init();
        };


        /** Load the over icon. **/
        public function loadOverIcon(url:String):void {
            _overLoader.load(new URLRequest(url));
        };


        /** Set the out icon when loaded. **/
        private function _loadOverHandler(event:Event):void {
            setOverIcon(_overLoader);
        };


        /** The button is clicked. **/
        private function _onClick(event:MouseEvent):void {
            ExternalInterface.call(_click,name);
        };


        /** Set a JS click handler. **/
        public function setClickFunction(click:String):void {
            _click = click;
            clickFunction = _onClick;
        };


    }


}

