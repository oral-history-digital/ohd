import { createRoot } from 'react-dom/client';
import videojs from 'video.js';
import { MdOutlineFitScreen } from "react-icons/md";
import { SET_PLAYER_SIZE } from '../action-types';

const VjsButton = videojs.getComponent('Button');

// A singleton to store a reference to the Redux store
let storeInstance = null;

// Function to be called by React components to set the store reference
export function setStoreReference(store) {
  storeInstance = store;
}

class ToggleSizeButton extends VjsButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-toggle-size-button');
    this.options_ = options;
    this.currentPlayerSize = 'medium'; // Track size locally
  }

  handleClick() {
    if (!storeInstance) {
      console.error('Redux store reference not set');
      return;
    }

    // Get current state from Redux
    const state = storeInstance.getState();
    const mediaPlayerState = state.mediaPlayer;
    
    // Use our local tracking if Redux state seems inconsistent
    const currentSize = mediaPlayerState?.playerSize || this.currentPlayerSize;
    
    // Toggle size between small and medium
    const newSize = currentSize === 'small' ? 'medium' : 'small';
    this.currentPlayerSize = newSize; // Update our local tracking
    
    
    // Use the exact action type constant imported from action-types.js
    const setPlayerSize = (size) => ({
      type: SET_PLAYER_SIZE,
      payload: { size }
    });
    
    // Dispatch action to Redux
    storeInstance.dispatch(setPlayerSize(newSize));
    
    // Update height directly for immediate visual feedback
    const mediaPlayerElement = document.querySelector('.MediaPlayer');
    if (mediaPlayerElement) {
      const heightVariable = newSize === 'small' ? 
        'var(--media-player-height-small)' : 
        'var(--media-player-height-medium)';
      mediaPlayerElement.style.height = heightVariable;
      
      // Ensure Layout classes are also updated for proper styling
      const layoutElement = document.querySelector('.Layout');
      if (layoutElement) {
        if (newSize === 'small') {
          layoutElement.classList.add('is-small-player');
          layoutElement.classList.remove('is-medium-player');
        } else {
          layoutElement.classList.add('is-medium-player');
          layoutElement.classList.remove('is-small-player');
        }
      }
    }
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