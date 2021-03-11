import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        transcriptScrollEnabled: true,
        tabIndex: 2,
    },
};

test('getTranscriptScrollEnabled retrieves if video is fixed', () => {
    expect(selectors.getTranscriptScrollEnabled(state)).toEqual(state[NAME].transcriptScrollEnabled);
});

test('getTabIndex retrieves index of interview tabs', () => {
    expect(selectors.getTabIndex(state)).toEqual(state[NAME].tabIndex);
});
