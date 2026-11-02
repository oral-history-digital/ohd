import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PLAYBACK_RATES } from 'modules/media-player';
import { updatePlaybackRate } from 'modules/media-player/redux/actions';
import mediaPlayer from 'modules/media-player/redux/reducer';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import PreviewPlayer from './PreviewPlayer';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));
jest.mock('../hooks', () => ({
    useSegmentPreview: () => ({
        isPreviewPlaying: false,
        togglePlayPause: jest.fn(),
        seekToStart: jest.fn(),
        seekBy: jest.fn(),
        currentTime: 0,
    }),
}));

test('changes the shared speed and reflects changes from other player controls', async () => {
    const store = createStore((state = {}, action) => ({
        'media-player': mediaPlayer(state['media-player'], action),
    }));
    render(
        <Provider store={store}>
            <PreviewPlayer segment={{ timecode: '00:00:00.000' }} />
        </Provider>
    );
    const select = screen.getByRole('combobox', {
        name: 'media_player.playback_rate',
    });
    expect(select.value).toBe('1');
    expect(
        screen.getAllByRole('option').map((option) => Number(option.value))
    ).toEqual(PLAYBACK_RATES);
    await userEvent.setup().selectOptions(select, '1.5');
    expect(store.getState()['media-player'].playbackRate).toBe(1.5);
    act(() => store.dispatch(updatePlaybackRate(0.8)));
    expect(select.value).toBe('0.8');
});
