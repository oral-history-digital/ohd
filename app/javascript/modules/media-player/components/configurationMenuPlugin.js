// configurationMenuPlugin.js

import videojs from "video.js";
import { createRoot } from "react-dom/client";
import ConfigurationMenu from "./ConfigurationMenu";

const VjsButton = videojs.getComponent("Button");

/**
 * ConfigurationControl
 * --------------------
 * Custom Video.js button component that renders the React-based configuration menu.
 */
class ConfigurationControl extends VjsButton {
  constructor(player, options) {
    super(player, options);
    this.addClass("vjs-configuration-plugin");
    this.options_ = options;
  }

  createEl() {
    const el = super.createEl("div", {
      className: "vjs-configuration-plugin-container",
    });

    this.reactRoot = document.createElement("div");
    el.appendChild(this.reactRoot);

    this.root = createRoot(this.reactRoot);
    this.root.render(
      <ConfigurationMenu
        player={this.player_}
        playbackRates={this.options_.playbackRates || this.player_.options_.playbackRates || [0.5, 1, 1.5, 2]}
        qualities={this.options_.qualities || ["Default"]}
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

/**
 * Plugin definition
 */
function configurationMenuPlugin(pluginOptions = {}) {
  if (this.configurationMenuPluginInitialized) return;
  this.configurationMenuPluginInitialized = true;

  if (!videojs.getComponent("ConfigurationControl")) {
    videojs.registerComponent("ConfigurationControl", ConfigurationControl);
  }

  if (!pluginOptions.playbackRates && this.options_.playbackRates) {
    pluginOptions.playbackRates = this.options_.playbackRates;
  }

  this.getChild("controlBar").addChild("ConfigurationControl", pluginOptions, 6);
}

videojs.registerPlugin("configurationMenuPlugin", configurationMenuPlugin);

export default configurationMenuPlugin;
