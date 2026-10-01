import videoJsQualitySelector from '@silvermine/videojs-quality-selector';
import { act, render } from '@testing-library/react';
import videojs from 'video.js';

import VideoJS from './VideoJS';

jest.mock('@silvermine/videojs-quality-selector', () => jest.fn());
jest.mock('video.js', () => jest.fn());
jest.mock('../hooks/useVideojsLanguages', () => jest.fn(() => null));

describe('VideoJS', () => {
    const player = {
        bigPlayButton: { el: jest.fn(() => document.createElement('button')) },
        dispose: jest.fn(),
        language: jest.fn(() => 'en'),
        off: jest.fn(),
        on: jest.fn(),
        paused: jest.fn(() => true),
        trigger: jest.fn(),
    };

    beforeEach(() => {
        videojs.mockClear();
        videojs.addLanguage = jest.fn();
        videojs.mockImplementation((_element, _options, onReady) => {
            setTimeout(onReady, 0);
            return player;
        });
    });

    it('registers the quality selector, initializes the player, and disposes it', async () => {
        const onReady = jest.fn();
        const { unmount } = render(
            <VideoJS
                type="video"
                options={{
                    sources: [{ src: '/video.mp4', type: 'video/mp4' }],
                }}
                onReady={onReady}
            />
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(videoJsQualitySelector).toHaveBeenCalledWith(videojs);
        expect(videojs).toHaveBeenCalledWith(
            expect.any(HTMLVideoElement),
            expect.objectContaining({ fluid: true }),
            expect.any(Function)
        );
        expect(onReady).toHaveBeenCalledWith(player);

        unmount();

        expect(player.dispose).toHaveBeenCalledTimes(1);
    });
});
