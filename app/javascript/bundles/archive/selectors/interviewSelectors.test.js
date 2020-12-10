import * as selectors from './interviewSelectors';

const state = {
  interview: {
    tape: 2,
    videoTime: 0,
    videoStatus: 'pause',
    transcriptTime: 13.46,
    transcriptScrollEnabled: true,
    resolution: '720p',
  },
};

test('getCurrentTape retrieves current tape number', () => {
  expect(selectors.getCurrentTape(state)).toEqual(state.interview.tape);
});

test('getVideoTime retrieves video time', () => {
  expect(selectors.getVideoTime(state)).toEqual(state.interview.videoTime);
});

test('getVideoStatus retrieves video status', () => {
  expect(selectors.getVideoStatus(state)).toEqual(state.interview.videoStatus);
});

test('getTranscriptTime retrieves transcript time', () => {
  expect(selectors.getTranscriptTime(state)).toEqual(state.interview.transcriptTime);
});

test('getTranscriptScrollEnabled retrieves if video is fixed', () => {
  expect(selectors.getTranscriptScrollEnabled(state)).toEqual(state.interview.transcriptScrollEnabled);
});

test('getVideoResolution retrieves video resolution', () => {
  expect(selectors.getVideoResolution(state)).toEqual(state.interview.resolution);
});
