import { createRoot } from 'react-dom/client';
import videojs from 'video.js';
import ConfigurationMenu from './ConfigurationMenu';

const VjsButton = videojs.getComponent('Button');

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

    this.reactRoot = document.createElement('div');
    el.appendChild(this.reactRoot);

    // Create a React root and initially render the ConfigurationMenu.
    this.root = createRoot(this.reactRoot);
    this.root.render(
      <ConfigurationMenu
        player={this.player_}
        playbackRates={
          this.options_.playbackRates ||
          this.player_.options_.playbackRates ||
          [0.5, 1, 1.5, 2]
        }
        qualities={this.options_.qualities || ['Default']}
      />
    );

    return el;
  }

  dispose() {
    if (this.root) {
      this.root.unmount();
    }
    super.dispose();
  }
}

function configurationMenuPlugin(pluginOptions = {}) {
  // If the plugin is not yet initialized, initialize it.
  if (!this.configurationMenuPluginInitialized) {
    this.configurationMenuPluginInitialized = true;
    if (!videojs.getComponent('ConfigurationControl')) {
      videojs.registerComponent('ConfigurationControl', ConfigurationControl);
    }

    // Use the default playback rates if not provided
    if (!pluginOptions.playbackRates && this.options_.playbackRates) {
      pluginOptions.playbackRates = this.options_.playbackRates;
    }

    this.getChild('controlBar').addChild('ConfigurationControl', pluginOptions, 6);
  } else {
    // Plugin is already in place; update its options.
    const control = this.getChild('controlBar').getChild('ConfigurationControl');
    if (control) {
      control.options_ = { ...control.options_, ...pluginOptions };
      control.root.render(
        <ConfigurationMenu
          player={control.player_}
          playbackRates={
            control.options_.playbackRates ||
            control.player_.options_.playbackRates ||
            [0.5, 1, 1.5, 2]
          }
          qualities={control.options_.qualities || ['Default']}
        />
      );
    }
  }
}

videojs.registerPlugin('configurationMenuPlugin', configurationMenuPlugin);

export default configurationMenuPlugin;
