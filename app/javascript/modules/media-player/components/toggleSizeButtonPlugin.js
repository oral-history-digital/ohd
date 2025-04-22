import { createRoot } from 'react-dom/client';
import videojs from 'video.js';
import { MdOutlineFitScreen } from 'react-icons/md';
import { SET_PLAYER_SIZE } from '../action-types';
import { isMobile } from 'modules/user-agent';

const VjsButton = videojs.getComponent('Button');

/* ------------------------------------------------------------------ */
/*  Simple utilities                                                  */
/* ------------------------------------------------------------------ */

/** Mobile OR <1200px ⇒ we treat the viewport as “compact” */
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

    /* Hide on compact viewports right from the start */
    if (isCompactViewport()) this.hide();

    /* Bind & attach resize listener */
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
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

    this.store.dispatch(setPlayerSize(newSize));
    applyLayoutSize(newSize);
  }

  /* -------- Video.js required overrides --------------------------- */

  createEl() {
    const el = super.createEl('button', {
      className: 'vjs-control vjs-button vjs-toggle-size-button',
      title: 'Toggle player size' // Fallback title attribute
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
    this.getChild('controlBar').addChild('ToggleSizeButton', options, 7);
  }
}

videojs.registerPlugin('toggleSizePlugin', toggleSizePlugin);
export default toggleSizePlugin;