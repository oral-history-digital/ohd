import { createRoot } from 'react-dom/client';
import { TbRewindBackward5, TbRewindForward5 } from 'react-icons/tb';
import videojs from 'video.js';

// Import the necessary Video.js components
const Button = videojs.getComponent('Button');

// Create custom forward button class
class CustomForwardButton extends Button {
    constructor(player, options) {
        super(player, options);
        this.addClass('vjs-custom-skip-forward');

        const translations = options.translations || {};
        const stepText =
            translations.skipForward || `Forward ${options.step || 5} seconds`;
        this.controlText(stepText);
    }

    handleClick() {
        const now = this.player_.currentTime();
        const step = this.options_.step || 5;
        this.player_.currentTime(now + step);
    }

    createEl() {
        const el = super.createEl();

        // Replace the inner content with our custom React icon
        const iconContainer = el.querySelector('.vjs-icon-placeholder') || el;
        if (iconContainer) {
            createRoot(iconContainer).render(
                <TbRewindForward5 style={{ fontSize: '1.2rem' }} />
            );
        }

        return el;
    }
}

// Create custom backward button class
class CustomBackwardButton extends Button {
    constructor(player, options) {
        super(player, options);
        this.addClass('vjs-custom-skip-backward');

        const translations = options.translations || {};
        const stepText =
            translations.skipBack || `Backward ${options.step || 5} seconds`;
        this.controlText(stepText);
    }

    handleClick() {
        const now = this.player_.currentTime();
        const step = this.options_.step || 5;
        this.player_.currentTime(Math.max(0, now - step));
    }

    createEl() {
        const el = super.createEl();

        // Replace the inner content with our custom React icon
        const iconContainer = el.querySelector('.vjs-icon-placeholder') || el;
        if (iconContainer) {
            createRoot(iconContainer).render(
                <TbRewindBackward5 style={{ fontSize: '1.2rem' }} />
            );
        }

        return el;
    }
}

// Register the custom components
videojs.registerComponent('CustomForwardButton', CustomForwardButton);
videojs.registerComponent('CustomBackwardButton', CustomBackwardButton);

// Plugin function
function customSkipButtonsPlugin(options = {}) {
    const player = this;
    const translations = options.translations || {};

    // Function to update button translations
    const updateTranslations = (newTranslations) => {
        const forwardButton = player.controlBar.getChild('CustomForwardButton');
        const backwardButton = player.controlBar.getChild(
            'CustomBackwardButton'
        );

        if (forwardButton && newTranslations.skipForward) {
            forwardButton.controlText(newTranslations.skipForward);
        }

        if (backwardButton && newTranslations.skipBack) {
            backwardButton.controlText(newTranslations.skipBack);
        }
    };

    // Listen for plugin translation updates
    player.on('pluginTranslationsUpdated', (event, newTranslations) => {
        updateTranslations(newTranslations);
    });

    // Run on ready to make sure the control bar exists
    player.ready(() => {
        const controlBar = player.controlBar;

        // Remove the default skip buttons if they exist
        const existingForward = controlBar.getChild('skipForward');
        const existingBackward = controlBar.getChild('skipBackward');

        if (existingForward) {
            controlBar.removeChild('skipForward');
        }

        if (existingBackward) {
            controlBar.removeChild('skipBackward');
        }

        // Get the step values from options
        const forwardStep =
            player.options_.controlBar?.skipButtons?.forward || 5;
        const backwardStep =
            player.options_.controlBar?.skipButtons?.backward || 5;

        // Add our custom buttons in the same positions
        const playToggleIndex = controlBar.children_.indexOf(
            controlBar.getChild('playToggle')
        );

        if (playToggleIndex !== -1) {
            controlBar.addChild(
                'CustomForwardButton',
                {
                    step: forwardStep,
                    translations: translations,
                },
                playToggleIndex + 1
            );

            controlBar.addChild(
                'CustomBackwardButton',
                {
                    step: backwardStep,
                    translations: translations,
                },
                playToggleIndex
            );
        } else {
            // Fallback if playToggle doesn't exist
            controlBar.addChild('CustomBackwardButton', {
                step: backwardStep,
                translations: translations,
            });
            controlBar.addChild('CustomForwardButton', {
                step: forwardStep,
                translations: translations,
            });
        }
    });
}

// Register the plugin
videojs.registerPlugin('customSkipButtonsPlugin', customSkipButtonsPlugin);

export default customSkipButtonsPlugin;
