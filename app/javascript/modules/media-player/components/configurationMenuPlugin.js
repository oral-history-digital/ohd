import { createRoot } from 'react-dom/client';
import videojs from 'video.js';
import ConfigurationMenu from './ConfigurationMenu';

const VjsButton = videojs.getComponent('Button');

/* ------------------------------------------------------------------ */
/*  Small helpers                                                     */
/* ------------------------------------------------------------------ */

/** Resolve playback‑rate array from plugin options or player defaults */
const getPlaybackRates = (player, opts) =>
  opts.playbackRates || player.options_.playbackRates || [0.5, 1, 1.5, 2];

/** Resolve quality list */
const getQualities = (opts) => opts.qualities || ['Default'];

/** Render (or re‑render) React menu into given root */
const renderMenu = (root, player, opts) => {
  root.render(
    <ConfigurationMenu
      player={player}
      playbackRates={getPlaybackRates(player, opts)}
      qualities={getQualities(opts)}
    />,
  );
};

/* ------------------------------------------------------------------ */
/*  Video.js component                                                */
/* ------------------------------------------------------------------ */

class ConfigurationControl extends VjsButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-configuration-plugin');
    this.options_ = options;
  }

  createEl() {
    const el = super.createEl('div', {
      className: 'vjs-configuration-plugin-container',
    });

    /* Prepare a div for React */
    this.reactRoot = document.createElement('div');
    el.appendChild(this.reactRoot);

    /* Mount React once */
    this.root = createRoot(this.reactRoot);
    renderMenu(this.root, this.player_, this.options_);

    return el;
  }

  /** Update menu when plugin options change (called by plugin) */
  updateOptions(newOpts) {
    this.options_ = { ...this.options_, ...newOpts };
    renderMenu(this.root, this.player_, this.options_);
  }

  dispose() {
    this.root?.unmount();
    super.dispose();
  }
}

videojs.registerComponent('ConfigurationControl', ConfigurationControl);

/* ------------------------------------------------------------------ */
/*  Video.js plugin wrapper                                           */
/* ------------------------------------------------------------------ */

function configurationMenuPlugin(opts = {}) {
  if (!this.configurationMenuPluginInitialized) {
    this.configurationMenuPluginInitialized = true;

    /* Add the control once */
    this
      .getChild('controlBar')
      .addChild('ConfigurationControl', opts, 6);
  } else {
    /* Already exists: just pass new options down */
    const control = this
      .getChild('controlBar')
      .getChild('ConfigurationControl');

    control?.updateOptions(opts);
  }
}

videojs.registerPlugin('configurationMenuPlugin', configurationMenuPlugin);
export default configurationMenuPlugin;
