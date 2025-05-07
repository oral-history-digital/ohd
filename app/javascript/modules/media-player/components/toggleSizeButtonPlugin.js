import { createRoot } from 'react-dom/client';
import videojs from 'video.js';
import { MdOutlineFitScreen } from 'react-icons/md';
import { SET_PLAYER_SIZE } from '../action-types';
import { isMobile } from 'modules/user-agent';

const VjsButton = videojs.getComponent('Button');

/* ------------------------------------------------------------------ */
/*  Simple utilities                                                  */
/* ------------------------------------------------------------------ */

/** Mobile OR <1200px ⇒ we treat the viewport as "compact" */
const isCompactViewport = () => isMobile() || window.innerWidth < 1200;

/** Redux action creator */
const setPlayerSize = (size) => ({
  type: SET_PLAYER_SIZE,
  payload: { size },
});

/** Apply CSS height + layout classes in one spot */
const applyLayoutSize = (size) => {
  const mediaPlayer = document.querySelector('.MediaPlayer');
  const layout = document.querySelector('.Layout');
  if (!mediaPlayer || !layout) return;

  mediaPlayer.style.height =
    size === 'small'
      ? 'var(--media-player-height-small)'
      : 'var(--media-player-height-medium)';

  layout.classList.toggle('is-small-player', size === 'small');
  layout.classList.toggle('is-medium-player', size === 'medium');
};

/* ------------------------------------------------------------------ */
/*  Redux store reference (singleton‑style)                           */
/* ------------------------------------------------------------------ */

let storeInstance = null; // Will be filled by setStoreReference()

export const setStoreReference = (store) => {
  storeInstance = store;
};

/* ------------------------------------------------------------------ */
/*  Video.js button                                                   */
/* ------------------------------------------------------------------ */

class ToggleSizeButton extends VjsButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-toggle-size-button');
    this.currentPlayerSize = 'medium';
    this.store = storeInstance || options.store; // fall‑back if passed via plugin
    this.subtitleTrackWasEnabled = false; // Track subtitle state
    this.lastActiveTrackIndex = -1; // Track which track was active

    /* Hide on compact viewports right from the start */
    if (isCompactViewport()) this.hide();

    /* Bind & attach resize listener */
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    
    /* Handle fullscreen changes */
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
    this.player_.on('fullscreenchange', this.handleFullscreenChange);
  }

  /* -------- event handlers ---------------------------------------- */

  handleResize() {
    if (isCompactViewport()) {
      // hide if mobile/small OR while the player is in fullscreen
      if (isCompactViewport() || this.player_.isFullscreen()) {
        this.hide();
      } else {
        this.show();
      }
    }
  }
  
  // Saves the currently active subtitle track
  saveActiveSubtitleTrack() {
    const textTracks = this.player_.textTracks();
    this.lastActiveTrackIndex = -1;
    this.subtitleTrackWasEnabled = false;
    
    for (let i = 0; i < textTracks.length; i++) {
      if (textTracks[i].mode === 'showing') {
        this.subtitleTrackWasEnabled = true;
        this.lastActiveTrackIndex = i;
        break;
      }
    }
    
    return this.subtitleTrackWasEnabled;
  }
  
  // Restores the previously active subtitle track
  restoreActiveSubtitleTrack() {
    if (this.subtitleTrackWasEnabled && this.lastActiveTrackIndex >= 0) {
      const textTracks = this.player_.textTracks();
      if (textTracks.length > this.lastActiveTrackIndex) {
        textTracks[this.lastActiveTrackIndex].mode = 'showing';
        return true;
      }
    }
    return false;
  }
  
  handleFullscreenChange() {
    const subsCapsButton = this.player_.controlBar.getChild('subsCapsButton');
    
    if (this.player_.isFullscreen()) {
      // In fullscreen, always enable subtitles
      if (subsCapsButton) {
        subsCapsButton.enable();
        
        // If subtitles were previously enabled, restore them
        if (this.subtitleTrackWasEnabled) {
          this.restoreActiveSubtitleTrack();
        }
      }
    } else if (this.currentPlayerSize === 'small') {
      // When exiting fullscreen, if we're in small size
      if (subsCapsButton) {
        // Save current subtitle state before disabling
        this.saveActiveSubtitleTrack();
        
        // Disable button and subtitles
        subsCapsButton.disable();
        
        // Disable active subtitle tracks
        const textTracks = this.player_.textTracks();
        for (let i = 0; i < textTracks.length; i++) {
          if (textTracks[i].mode === 'showing') {
            textTracks[i].mode = 'disabled';
          }
        }
      }
    }
  }

  handleClick() {
    if (isCompactViewport()) return;                 // No toggle on small screens
    if (!this.store) {
      console.error('ToggleSizeButton: Redux store not available');
      return;
    }

    const { mediaPlayer = {} } = this.store.getState();
    const currentSize = mediaPlayer.playerSize || this.currentPlayerSize;
    const newSize = currentSize === 'small' ? 'medium' : 'small';
    this.currentPlayerSize = newSize;

    // Manage subtitle button and track state when changing sizes
    const subsCapsButton = this.player_.controlBar.getChild('subsCapsButton');
    
    if (newSize === 'small') {
      if (subsCapsButton) {
        // Save current subtitle state before disabling
        this.saveActiveSubtitleTrack();
        
        // Disable the button
        subsCapsButton.disable();
        
        // Disable active subtitle tracks
        const textTracks = this.player_.textTracks();
        for (let i = 0; i < textTracks.length; i++) {
          if (textTracks[i].mode === 'showing') {
            textTracks[i].mode = 'disabled';
          }
        }
      }
    } else {
      // Re-enable button when returning to medium size
      if (subsCapsButton) {
        subsCapsButton.enable();
        
        // If subtitles were previously enabled, turn them back on
        this.restoreActiveSubtitleTrack();
      }
    }

    this.store.dispatch(setPlayerSize(newSize));
    applyLayoutSize(newSize);
  }

  /* -------- Video.js required overrides --------------------------- */

  createEl() {
    const el = super.createEl('button', {
      className: 'vjs-control vjs-button vjs-toggle-size-button',
      title: this.options_.buttonTitle
    });

    /* Render icon with React inside the native Video.js button */
    createRoot(el).render(
      <span className="vjs-icon-placeholder">
        <MdOutlineFitScreen style={{ fontSize: '1.2rem' }} />
      </span>,
    );

    return el;
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
    this.player_.off('fullscreenchange', this.handleFullscreenChange);
    super.dispose();
  }
}

videojs.registerComponent('ToggleSizeButton', ToggleSizeButton);

/* ------------------------------------------------------------------ */
/*  Video.js plugin wrapper                                           */
/* ------------------------------------------------------------------ */

function toggleSizePlugin(options = {}) {
  if (this.toggleSizePluginInitialized) return;
  this.toggleSizePluginInitialized = true;

  /* Allow passing the Redux store via options when initializing */
  if (options.store) setStoreReference(options.store);

  /* Add the control only on non‑compact viewports (desktop) */
  if (!isCompactViewport()) {
    this.getChild('controlBar').addChild('ToggleSizeButton', options, 9);
  }
}

videojs.registerPlugin('toggleSizePlugin', toggleSizePlugin);
export default toggleSizePlugin;