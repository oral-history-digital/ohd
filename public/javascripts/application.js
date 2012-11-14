// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/geral/utf-8 [v1.0]

UTF8 = {
	encode: function(s){
		for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
			s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
		);
		return s.join("");
	},
	decode: function(s){
		for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
			((a = s[i][c](0)) & 0x80) &&
			(s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
			o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
		);
		return s.join("");
	}
};

/*
 * Registers a callback which copies the csrf token into the
 * X-CSRF-Token header with each ajax request.  Necessary to
 * work with rails applications which have fixed
 * CVE-2011-0447
*/

Ajax.Responders.register({
  onCreate: function(request) {
    var csrf_meta_tag = $$('meta[name=csrf-token]')[0];

    if (csrf_meta_tag) {
      var header = 'X-CSRF-Token',
          token = csrf_meta_tag.readAttribute('content');

      if (!request.options.requestHeaders) {
        request.options.requestHeaders = {};
      }
      request.options.requestHeaders[header] = token;
    }
  }
});

/* Helper functions */
function loadScript(src, callback) {
    if(!callback) { callback = function() {}; }
    var script = new Element('script', { 'src': src, 'type': 'text/javascript'});
    script.onload = callback;
    script.onreadystatechange = function(){
        if(this.readyState == 'complete') {
            callback();
        }
    }
    $('baseContent').insert({bottom: script});
}

function writeCookie(key, value, validity) {
    var expiry = new Date();
    if(validity) {
        expiry.setTime((new Date()).getTime() + 3600000 * 24 * validity);
        expiry = expiry.toGMTString();
    } else {
        expiry = new Date(1970).toGMTString();
    }
    document.cookie = key + '=' + value + '; expires=' + expiry;
}

function readCookie(key) {
    var values = [];
    var cookieKeyRegexp = new RegExp(key + '=[^;]+');
    var cookieValues = document.cookie.match(cookieKeyRegexp);
    if(cookieValues) {
        var idx = cookieValues.length;
        while(idx--) {
            // skip the key + 1 character ('=')
            var cvalues = cookieValues[idx].substring(key.length+1).match(/[a-z0-9A-Z_-]+/g);
            if(cvalues) {
                var ldx = cvalues.length;
                while(ldx--) {
                    values.push(cvalues[ldx]);
                }
            }
        }
    }
    return (values.length < 2) ? values.first() : values;
}


/* code for Expansion/Minimization usability */
var togglingContent = 0;
var contentItems = new Array();

function setItemStatus(el, open) {
    if(open) {
        el.addClassName('open');
        el.removeClassName('closed');
    } else {
        el.removeClassName('open');
        el.addClassName('closed');
    }
}

function toggleUserContent(event) {
    if(togglingContent > 0) { return; };
    var el = Element.up(Event.element(event), '.item');
    var details = el.down('.details');
    if(el.hasClassName('closed')) {
        // open
        expandContent(details,true);
    } else {
        // close
        minimizeContent(details,true);
    }
}

function expandAllContents() {
    if(togglingContent > 0) { return; };
    var closedContents = new Array();
    contentItems.each(function(el){
        if(el.parentNode.hasClassName('closed')) {
            closedContents[closedContents.length] = el;
        }
    });
    if(closedContents.length > 0) {
        Effect.multiple(closedContents, Effect.BlindDown, { duration: 0.5, beforeStart: function(){ closedContents.each(function(el){setItemStatus(el.parentNode, true);}); togglingContent = 1;}, afterFinish: function(){ togglingContent = 0; $('expand_all').hide(); $('minimize_all').show();}});
        new Effect.Fade('expand_all', { duration: 0.5 });
    } else {
        $('expand_all').hide();
        $('minimize_all').show();
    }
}

function minimizeAllContents() {
    if(togglingContent > 0) { return; };
    var openContents = new Array();
    contentItems.each(function(el){
        if(!el.parentNode.hasClassName('closed')) {
            openContents[openContents.length] = el;
        }
    });
    if(openContents.length > 0) {
        Effect.multiple(openContents, Effect.BlindUp, { duration: 0.5, beforeStart: function(){ togglingContent = 1;}, afterFinish: function(){ openContents.each(function(el){setItemStatus(el.parentNode, false);}); togglingContent = 0; $('minimize_all').hide(); $('expand_all').show();}});
        new Effect.Fade('minimize_all', { duration: 0.5 });
    } else {
        $('minimize_all').hide();
        $('expand_all').show();
    }
}

function expandContent(el,reset) {
    if(reset) {
        new Effect.BlindDown(el, { duration: 0.5, beforeStart: function(){setItemStatus(el.parentNode, true); togglingContent = 1;}, afterFinish: function(){ togglingContent = 0; }});
    } else {
        new Effect.BlindDown(el, { duration: 0.5, beforeStart: function(){setItemStatus(el.parentNode, true); togglingContent = 0;}});
    }
}

function minimizeContent(el, reset) {
    if(reset) {
        new Effect.BlindUp(el, { duration: 0.5, beforeStart: function(){togglingContent = 1;}, afterFinish: function(){setItemStatus(el.parentNode, false); togglingContent = 0; }});
    } else {
        new Effect.BlindUp(el, { duration: 0.5, afterFinish: function(){setItemStatus(el.parentNode, false); togglingContent = 0;}});
    }
}

function closeOpenActions() {
    $$('.actions.open').each(function(el){
        setItemStatus(el, false);
    });
}

/* Inline Editing, Utility */
function showInlineEditForm(id, textArea) {
  var displayEl = $(id + '_display');
  var formEl = $(id + '_form');
  var inputEl = $(id);
  var fieldWidth = displayEl.offsetWidth - 20;
  var fieldHeight = displayEl.offsetHeight + 25;
  displayEl.hide();
  inputEl.value = displayEl.innerHTML;
  formEl.show();
  var inputStyle = { width: fieldWidth + 'px'};
  if(textArea) {
      inputStyle = { width: fieldWidth + 'px', height: fieldHeight + 'px'};
  }
  inputEl.setStyle(inputStyle);
  Form.Element.focus(id);
}

function addExtraneousFormElements(form, scope, selector) {
  var existing = form.getInputs();
  form.up(scope).getElementsBySelector(selector).each(function(input){
      if(existing.indexOf(input) < 0) {
        form.insert(new Element('input', {name: input.getAttribute('name'), value: input.value, type: 'hidden'}));
      }
  });
}

function toggleFormAction(id) {
  togglingContent = 1;
  $(id + '_update').toggle();
  $(id + '_reset').toggle();
  $(id + '_spinner').toggle();
}
