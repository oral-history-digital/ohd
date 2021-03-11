import * as types from './action-types';
import * as actions from './actions';

test('setInterviewTabIndex', () => {
    const actual = actions.setInterviewTabIndex(1);
    const expected = {
        type: types.SET_INTERVIEW_TAB_INDEX,
        tabIndex: 1,
    };
    expect(actual).toEqual(expected);
});

test('handleTranscriptScroll', () => {
    const actual = actions.handleTranscriptScroll(true);
    const expected = {
        type: types.TRANSCRIPT_SCROLL,
        transcriptScrollEnabled: true,
    };
    expect(actual).toEqual(expected);
});
