
/**
 * ProgressBar for Google Maps v3
 * @version 1.1
 *
 * by José Fernando Calcerrada.
 *
 *
 * Licensed under the GPL licenses:
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 * Chagelog
 *
 * v1.1
 * - IE fixed
 * v1.2 (Jan Rietema)
 * - added an Overlay and Fade
 */

progressBar = function(opts) {

  var options = progressBar.combineOptions(opts, {
    height:       '1.75em',
    width:        '200px',
    top:          '32px',
    right:        '5px',
    colorBar:     '#68C',
    background:   '#FFF',
    fontFamily:   'Arial, sans-serif',
    fontSize:     '12px'
  });

  var current = 0;
  var total = 0;

  var shadow = '1px 1px #888';

  var overlay = document.createElement('div');
  overlay.style.width = '9999px';
  overlay.style.height = '9999px';
  overlay.style.cssText = 'opacity: 0.85; background-color: #F1F1EB;';
  overlay.style.display = 'block';
  overlay.style.textAlign = 'center';
  // overlay.style.verticalAlign = 'center'; // breaks IE8
  overlay.style.padding = '360px 950px 950px 245px';
  overlay.style.zIndex = '1000';
  overlay.style.position = 'relative';


  var div = document.createElement('div');
  div.id  = 'pg_div';
  var dstyle = div.style;
  div.style.cssText = 'box-shadow: ' + shadow + '; '
                    + '-webkit-box-shadow: ' + shadow + '; '
                    + '-moz-box-shadow: ' + shadow + '; ';
  dstyle.display     = 'none';
  dstyle.width       = options.width;
  dstyle.height      = options.height;
  dstyle.marginRight = '6px';
  dstyle.border      = '1px solid #BBB';
  dstyle.background  = options.background;
  dstyle.fontSize    = options.fontSize;
  dstyle.position    = 'relative';
  dstyle.textAlign   = 'left';

  var text = document.createElement('div');
  text.id  = 'pg_text';
  var tstyle = text.style;
  tstyle.position      = 'absolute';
  tstyle.color         = '#FFF';
  tstyle.fontWeight    = 'bold';
  tstyle.width         = '100%';
  tstyle.border        = '5px';
  tstyle.textAlign     = 'center';

  var bar = document.createElement('div');
  bar.id                    = 'pg_bar';
  bar.style.height          = options.height;
  bar.style.backgroundColor = options.colorBar;

  div.appendChild(text);
  div.appendChild(bar);

  overlay.appendChild(div);


  var draw = function(mapDiv) {
    overlay.style.cssText = control.style.cssText +
      'z-index: 20; position: absolute; '+
      'top: '+options.top+'; right: '+options.right+'; ';
      // document.getElementById(mapDiv).appendChild(overlay);
  }

  var start = function(total_) {
    if (parseInt(total_) === total_ && total_ > 0) {
      total = total_;
      current = 0;
      bar.style.width = '0%';
      text.innerHTML = I18n.t('map.progress.loading');
      div.style.display = 'block';
    }

    return total;
  }

  var updateBar = function(increase) {
    if (parseInt(increase) === increase && total) {
      current += parseInt(increase);
      if (current > total) {
        current = total;
      } else if (current < 0) {
        current = 0;
      }

      var percent = Math.round((current/total)*100);
      bar.style.width = percent + '%';
      text.innerHTML = I18n.t('map.progress.loaded', {percent: percent});

    } else if (!total){
      return total;
    }

    return current;
  }

  var hide = function() {
    new Effect.Fade(overlay, { duration: 1.2 });
  }

  var getDiv = function() {
    return overlay;
  }

  var getTotal = function() {
    return total;
  }

  var setTotal = function(total_) {
    total = total_;
  }

  var getCurrent = function() {
    return current;
  }

  var setCurrent = function(current_) {
    return updateBar(current_-current);
  }

  return {
    draw:         draw,
    start:        start,
    updateBar:    updateBar,
    hide:         hide,
    getDiv:       getDiv,
    getTotal:     getTotal,
    setTotal:     setTotal,
    getCurrent:   getCurrent,
    setCurrent:   setCurrent
  }

}

progressBar.combineOptions = function (overrides, defaults) {
  var result = {};
  if (!!overrides) {
    for (var prop in overrides) {
      if (overrides.hasOwnProperty(prop)) {
        result[prop] = overrides[prop];
      }
    }
  }
  if (!!defaults) {
    for (prop in defaults) {
      if (defaults.hasOwnProperty(prop) && (result[prop] === undefined)) {
        result[prop] = defaults[prop];
      }
    }
  }
  return result;
}