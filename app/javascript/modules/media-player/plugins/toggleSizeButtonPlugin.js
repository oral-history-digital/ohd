import { SCREEN_L, SCREEN_M } from 'modules/constants';
import { isMobile } from 'modules/user-agent';
import { createRoot } from 'react-dom/client';
import { MdOutlineFitScreen } from 'react-icons/md';
import videojs from 'video.js';
import { VIDEO_MAX_WIDTH_MEDIUM, VIDEO_MAX_WIDTH_SMALL } from '../constants';

const VjsButton = videojs.getComponent('Button');

/* ------------------------------------------------------------------ */
/*  Simple utilities                                                  */
/* ------------------------------------------------------------------ */

/** Mobile OR below medium breakpoint ⇒ we treat the viewport as "compact" */
const isCompactViewport = () => isMobile() || window.innerWidth < SCREEN_M;

/**
 * Toggle player size by manipulating video max-width
 */
const togglePlayerWidth = (isCompact) => {
    const maxWidth = isCompact ? VIDEO_MAX_WIDTH_SMALL : VIDEO_MAX_WIDTH_MEDIUM;
    document.documentElement.style.setProperty(
        '--media-player-video-max-width',
        maxWidth
    );
    // Save to sessionStorage
    sessionStorage.setItem('videoPlayerWidth', maxWidth);
};

/* ------------------------------------------------------------------ */
/*  Video.js button                                                   */
/* ------------------------------------------------------------------ */

class ToggleSizeButton extends VjsButton {
    constructor(player, options) {
        super(player, options);
        this.addClass('vjs-toggle-size-button');

        // Restore saved width or set initial size based on screen width
        const savedWidth = sessionStorage.getItem('videoPlayerWidth');
        if (savedWidth) {
            document.documentElement.style.setProperty(
                '--media-player-video-max-width',
                savedWidth
            );
            this.currentPlayerSize =
                savedWidth === VIDEO_MAX_WIDTH_SMALL ? 'small' : 'medium';
        } else {
            // Set initial size based on screen width: small for <SCREEN_L, medium for ≥SCREEN_L
            this.currentPlayerSize =
                window.innerWidth < SCREEN_L ? 'small' : 'medium';
        }
        this.subtitleTrackWasEnabled = false; // Track subtitle state
        this.lastActiveTrackIndex = -1; // Track which track was active

        // Set initial button title from plugin translations or fallback
        const initialTitle =
            (player.pluginTranslations &&
                player.pluginTranslations.toggleSize) ||
            options.buttonTitle ||
            'Toggle player size';
        this.updateButtonTitle(initialTitle);

        /* Hide on compact viewports right from the start */
        if (isCompactViewport()) this.hide();

        /* Bind & attach resize listener */
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);

        /* Handle fullscreen changes */
        this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
        this.player_.on('fullscreenchange', this.handleFullscreenChange);

        /* Listen for plugin translation updates */
        this.handleTranslationUpdate = this.handleTranslationUpdate.bind(this);
        this.player_.on(
            'pluginTranslationsUpdated',
            this.handleTranslationUpdate
        );
    }

    updateButtonTitle(title) {
        this.controlText(title);
        // Update the title attribute on the DOM element if it exists
        if (this.el() && this.el().setAttribute) {
            this.el().setAttribute('title', title);
        }
    }

    handleTranslationUpdate(event, newTranslations) {
        if (newTranslations && newTranslations.toggleSize) {
            this.updateButtonTitle(newTranslations.toggleSize);
        }
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
        const subsCapsButton =
            this.player_.controlBar.getChild('subsCapsButton');

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
        if (isCompactViewport()) return; // No toggle on small screens

        // Toggle between compact and expanded
        const isCurrentlyCompact = this.currentPlayerSize === 'small';
        const newSize = isCurrentlyCompact ? 'medium' : 'small';
        this.currentPlayerSize = newSize;

        // Apply CSS custom property change
        togglePlayerWidth(newSize === 'small');

        // Manage subtitle button and track state when changing sizes
        const subsCapsButton =
            this.player_.controlBar.getChild('subsCapsButton');

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
    }

    /* -------- Video.js required overrides --------------------------- */

    createEl() {
        const initialTitle =
            (this.player_.pluginTranslations &&
                this.player_.pluginTranslations.toggleSize) ||
            this.options_.buttonTitle ||
            'Toggle player size';

        const el = super.createEl('button', {
            className: 'vjs-control vjs-button vjs-toggle-size-button',
            title: initialTitle,
        });

        /* Render icon with React inside the native Video.js button */
        createRoot(el).render(
            <span className="vjs-icon-placeholder">
                <MdOutlineFitScreen style={{ fontSize: '1.2rem' }} />
            </span>
        );

        return el;
    }

    dispose() {
        window.removeEventListener('resize', this.handleResize);
        this.player_.off('fullscreenchange', this.handleFullscreenChange);
        this.player_.off(
            'pluginTranslationsUpdated',
            this.handleTranslationUpdate
        );
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

    /* Add the control only on non‑compact viewports (desktop) */
    if (!isCompactViewport()) {
        this.getChild('controlBar').addChild('ToggleSizeButton', options, 9);
    }
}

videojs.registerPlugin('toggleSizePlugin', toggleSizePlugin);
export default toggleSizePlugin;
