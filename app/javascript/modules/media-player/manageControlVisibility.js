/**
 * Manages the visibility of VideoJS controls based on fullscreen state.
 * Shows native controls in fullscreen mode and custom controls in normal mode.
 *
 * @param {Object} player - The VideoJS player instance
 */
export default function manageControlVisibility(player) {
    if (!player?.controlBar) return;

    const isFullscreen = player.isFullscreen();

    // Helper function to find control by name or constructor
    const findControl = (controlName, constructorName) => {
        return (
            player.controlBar.getChild(controlName) ||
            player.controlBar.children_?.find(
                (c) => c?.constructor?.name === constructorName
            )
        );
    };

    // Helper function to toggle control visibility
    const toggleControl = (control, showInFullscreen) => {
        if (!control) return;

        // Check if control has the required methods before calling them
        if (
            typeof control.show !== 'function' ||
            typeof control.hide !== 'function'
        ) {
            return;
        }

        if (
            (isFullscreen && showInFullscreen) ||
            (!isFullscreen && !showInFullscreen)
        ) {
            control.show();
        } else {
            control.hide();
        }
    };

    // Configure controls - show native controls in fullscreen, custom controls otherwise
    const controls = [
        {
            finder: () => findControl('qualitySelector', 'QualitySelector'),
            showInFullscreen: true,
        },
        {
            finder: () =>
                findControl('playbackRateMenuButton', 'PlaybackRateMenuButton'),
            showInFullscreen: true,
        },
        {
            finder: () =>
                findControl('ConfigurationControl', 'ConfigurationControl'),
            showInFullscreen: false,
        },
    ];

    controls.forEach(({ finder, showInFullscreen }) => {
        toggleControl(finder(), showInFullscreen);
    });
}
