import { createRoot } from 'react-dom/client';
import videojs from 'video.js';
import { MdOutlineFitScreen } from "react-icons/md";

const VjsButton = videojs.getComponent('Button');

class ToggleSizeButton extends VjsButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-toggle-size-button');
    this.options_ = options;
  }

  handleClick() {
    if (typeof this.options_.onToggleSize === 'function') {
      this.options_.onToggleSize();
    }
  }

  createEl() {
    const el = super.createEl('button', {
      className: 'vjs-control vjs-button vjs-toggle-size-button',
    });

    // Renderiza el ícono dinámico usando React
    const root = createRoot(el);
    root.render(
      <span className="vjs-icon-placeholder">
        <MdOutlineFitScreen style={{ fontSize: '1.2rem' }}/>
      </span>
    );

    return el;
  }
}

videojs.registerComponent('ToggleSizeButton', ToggleSizeButton);

function toggleSizePlugin(options = {}) {
  if (this.toggleSizePluginInitialized) return;
  this.toggleSizePluginInitialized = true;
  this.getChild('controlBar').addChild('ToggleSizeButton', options, 7);
}

videojs.registerPlugin('toggleSizePlugin', toggleSizePlugin);

export default toggleSizePlugin;