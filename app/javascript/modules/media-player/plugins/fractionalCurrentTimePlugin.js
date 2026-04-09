import { formatTimecode } from 'modules/utils';
import videojs from 'video.js';

const VjsCurrentTimeDisplay = videojs.getComponent('CurrentTimeDisplay');

/**
 * Extends the built-in CurrentTimeDisplay to show millisecond fractions
 * when the player is paused or the user is actively scrubbing.
 * durationDisplay and the progress-bar hover tooltip are unaffected.
 */
class FractionalCurrentTimeDisplay extends VjsCurrentTimeDisplay {
    constructor(player, options) {
        super(player, options);
        // timeupdate doesn't fire while paused, so re-render on play/pause
        // to switch between "0:25.300" ↔ "0:25"
        this.on(player, ['pause', 'play'], (e) => this.updateContent(e));
    }

    updateContent() {
        let time;
        if (this.player_.ended()) {
            time = this.player_.duration();
        } else {
            time = this.player_.scrubbing()
                ? this.player_.getCache().currentTime
                : this.player_.currentTime();
        }

        const showFractions = this.player_.paused() || this.player_.scrubbing();
        const timecodeFormat = this.options_.timecodeFormat ?? 'ms';
        const formattedTime = formatTimecode(
            time,
            false, // don't use Hms Format
            showFractions, // include fractions if paused or scrubbing
            false, // leave leading zeros
            timecodeFormat
        );

        if (formattedTime === this.formattedTime_) return;
        this.formattedTime_ = formattedTime;

        this.requestNamedAnimationFrame(
            'FractionalCurrentTimeDisplay#updateContent',
            () => {
                if (!this.contentEl_) return;
                let oldNode = this.textNode_;
                if (oldNode && this.contentEl_.firstChild !== oldNode) {
                    oldNode = null;
                }
                this.textNode_ = document.createTextNode(this.formattedTime_);
                if (!this.textNode_) return;
                if (oldNode) {
                    this.contentEl_.replaceChild(this.textNode_, oldNode);
                } else {
                    this.contentEl_.appendChild(this.textNode_);
                }
            }
        );
    }
}

videojs.registerComponent(
    'FractionalCurrentTimeDisplay',
    FractionalCurrentTimeDisplay
);
