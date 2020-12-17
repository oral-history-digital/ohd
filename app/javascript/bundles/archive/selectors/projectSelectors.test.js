import dotProp from 'dot-prop-immutable';
import * as selectors from './projectSelectors';

const state = {
    archive: {
        projectId: 'cdoh',
    },
};

describe('getShowFeaturedInterviews', () => {
    test('is false for mog project', () => {
        const _state = dotProp.set(state, 'archive.projectId', 'mog');

        expect(selectors.getShowFeaturedInterviews(_state)).toBeFalsy();
    });

    test('is false for campscapes project', () => {
        const _state = dotProp.set(state, 'archive.projectId', 'campscapes');
        expect(selectors.getShowFeaturedInterviews(_state)).toBeFalsy();
    });

    test('is true otherwise', () => {
        expect(selectors.getShowFeaturedInterviews(state)).toBeTruthy();
    });
});

describe('getShowStartpageVideo', () => {
    test('is true for mog project', () => {
        const _state = dotProp.set(state, 'archive.projectId', 'mog');

        expect(selectors.getShowStartpageVideo(_state)).toBeTruthy();
    });

    test('is false otherwise', () => {
        expect(selectors.getShowStartpageVideo(state)).toBeFalsy();
    });
});
