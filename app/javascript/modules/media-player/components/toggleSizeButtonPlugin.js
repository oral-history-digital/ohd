import { createRoot } from 'react-dom/client';
import videojs from 'video.js';
import { MdOutlineFitScreen } from "react-icons/md";

const VjsButton = videojs.getComponent('Button');

class ToggleSizeButton extends VjsButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-toggle-size-button');
    this.options_ = options;
    this.isSmallSize = false; // State to track current size
  }

  handleClick() {
    const layoutElement = document.querySelector('.Layout'); // Main container
    const mediaPlayerElement = document.querySelector('.MediaPlayer'); // Player container

    if (!layoutElement || !mediaPlayerElement) return;

    if (layoutElement.classList.contains('is-small-player')) {
      // If in small size, change to medium size
      layoutElement.classList.remove('is-small-player');
      layoutElement.classList.add('is-medium-player');
      mediaPlayerElement.style.height = 'var(--media-player-height-desktop)'; // Medium size
    } else {
      // If in medium (or default) size, change to small size
      layoutElement.classList.add('is-small-player');
      layoutElement.classList.remove('is-medium-player');
      mediaPlayerElement.style.height = 'var(--media-player-height-sticky)'; // Small size
    }

    this.isSmallSize = !this.isSmallSize; // Toggle state
  }

  createEl() {
    const el = super.createEl('button', {
      className: 'vjs-control vjs-button vjs-toggle-size-button',
    });

    // Render dynamic icon using React
    const root = createRoot(el);
    root.render(
      <span className="vjs-icon-placeholder">
        <MdOutlineFitScreen style={{ fontSize: '1.2rem' }} />
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