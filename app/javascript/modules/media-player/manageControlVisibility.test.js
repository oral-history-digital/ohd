import manageControlVisibility from './manageControlVisibility';

describe('manageControlVisibility', () => {
    let mockPlayer;
    let mockControls;

    beforeEach(() => {
        // Create mock controls with show/hide methods
        mockControls = {
            qualitySelector: {
                show: jest.fn(),
                hide: jest.fn(),
                constructor: { name: 'QualitySelector' },
            },
            playbackRateMenuButton: {
                show: jest.fn(),
                hide: jest.fn(),
                constructor: { name: 'PlaybackRateMenuButton' },
            },
            configurationControl: {
                show: jest.fn(),
                hide: jest.fn(),
                constructor: { name: 'ConfigurationControl' },
            },
        };

        // Create mock control bar
        const mockControlBar = {
            getChild: jest.fn((name) => {
                switch (name) {
                    case 'qualitySelector':
                        return mockControls.qualitySelector;
                    case 'playbackRateMenuButton':
                        return mockControls.playbackRateMenuButton;
                    case 'ConfigurationControl':
                        return mockControls.configurationControl;
                    default:
                        return null;
                }
            }),
            children_: [
                mockControls.qualitySelector,
                mockControls.playbackRateMenuButton,
                mockControls.configurationControl,
            ],
        };

        // Create mock player
        mockPlayer = {
            controlBar: mockControlBar,
            isFullscreen: jest.fn(),
        };
    });

    describe('when player is invalid', () => {
        test('returns early when player is null', () => {
            expect(() => manageControlVisibility(null)).not.toThrow();
        });

        test('returns early when player is undefined', () => {
            expect(() => manageControlVisibility(undefined)).not.toThrow();
        });

        test('returns early when player has no controlBar', () => {
            const playerWithoutControlBar = {};
            expect(() =>
                manageControlVisibility(playerWithoutControlBar)
            ).not.toThrow();
        });
    });

    describe('when in normal (non-fullscreen) mode', () => {
        beforeEach(() => {
            mockPlayer.isFullscreen.mockReturnValue(false);
        });

        test('shows custom configuration control', () => {
            manageControlVisibility(mockPlayer);
            expect(mockControls.configurationControl.show).toHaveBeenCalled();
            expect(
                mockControls.configurationControl.hide
            ).not.toHaveBeenCalled();
        });

        test('hides native quality selector control', () => {
            manageControlVisibility(mockPlayer);
            expect(mockControls.qualitySelector.hide).toHaveBeenCalled();
            expect(mockControls.qualitySelector.show).not.toHaveBeenCalled();
        });

        test('hides native playback rate menu button', () => {
            manageControlVisibility(mockPlayer);
            expect(mockControls.playbackRateMenuButton.hide).toHaveBeenCalled();
            expect(
                mockControls.playbackRateMenuButton.show
            ).not.toHaveBeenCalled();
        });
    });

    describe('when in fullscreen mode', () => {
        beforeEach(() => {
            mockPlayer.isFullscreen.mockReturnValue(true);
        });

        test('hides custom configuration control', () => {
            manageControlVisibility(mockPlayer);
            expect(mockControls.configurationControl.hide).toHaveBeenCalled();
            expect(
                mockControls.configurationControl.show
            ).not.toHaveBeenCalled();
        });

        test('shows native quality selector control', () => {
            manageControlVisibility(mockPlayer);
            expect(mockControls.qualitySelector.show).toHaveBeenCalled();
            expect(mockControls.qualitySelector.hide).not.toHaveBeenCalled();
        });

        test('shows native playback rate menu button', () => {
            manageControlVisibility(mockPlayer);
            expect(mockControls.playbackRateMenuButton.show).toHaveBeenCalled();
            expect(
                mockControls.playbackRateMenuButton.hide
            ).not.toHaveBeenCalled();
        });
    });

    describe('control finding fallbacks', () => {
        test('finds controls by constructor name when getChild fails', () => {
            // Clear any previous call history
            Object.values(mockControls).forEach((control) => {
                control.show.mockClear();
                control.hide.mockClear();
            });

            // Mock getChild to return null, forcing fallback to children_ array
            mockPlayer.controlBar.getChild.mockReturnValue(null);

            mockPlayer.isFullscreen.mockReturnValue(false);
            manageControlVisibility(mockPlayer);

            // Should still find and manage controls via children_ array
            expect(mockControls.configurationControl.show).toHaveBeenCalled();
            expect(mockControls.qualitySelector.hide).toHaveBeenCalled();
            expect(mockControls.playbackRateMenuButton.hide).toHaveBeenCalled();
        });

        test('handles missing controls gracefully', () => {
            // Mock controlBar with no controls
            mockPlayer.controlBar = {
                getChild: jest.fn(() => null),
                children_: [],
            };

            expect(() => manageControlVisibility(mockPlayer)).not.toThrow();
        });
    });

    describe('edge cases', () => {
        test('handles controls without show/hide methods', () => {
            const brokenControl = {};
            mockPlayer.controlBar.getChild.mockImplementation((name) => {
                if (name === 'ConfigurationControl') return brokenControl;
                return null;
            });

            expect(() => manageControlVisibility(mockPlayer)).not.toThrow();
        });

        test('handles isFullscreen throwing an error', () => {
            mockPlayer.isFullscreen.mockImplementation(() => {
                throw new Error('Fullscreen API not available');
            });

            expect(() => manageControlVisibility(mockPlayer)).toThrow();
        });
    });

    describe('integration scenarios', () => {
        test('correctly manages all controls in a typical fullscreen transition', () => {
            // Start in normal mode
            mockPlayer.isFullscreen.mockReturnValue(false);
            manageControlVisibility(mockPlayer);

            expect(mockControls.configurationControl.show).toHaveBeenCalled();
            expect(mockControls.qualitySelector.hide).toHaveBeenCalled();
            expect(mockControls.playbackRateMenuButton.hide).toHaveBeenCalled();

            // Reset mocks
            Object.values(mockControls).forEach((control) => {
                control.show.mockClear();
                control.hide.mockClear();
            });

            // Switch to fullscreen mode
            mockPlayer.isFullscreen.mockReturnValue(true);
            manageControlVisibility(mockPlayer);

            expect(mockControls.configurationControl.hide).toHaveBeenCalled();
            expect(mockControls.qualitySelector.show).toHaveBeenCalled();
            expect(mockControls.playbackRateMenuButton.show).toHaveBeenCalled();
        });
    });
});
