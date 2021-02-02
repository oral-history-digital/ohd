import dotProp from 'dot-prop-immutable';
import * as selectors from './projectSelectors';

const state = {
    archive: {
        locale: 'de',
        projectId: 'cdoh',
    },
    data: {
        projects: {
            1: {
                id: 1,
                type: 'Project',
                identifier: 'cdoh',
                translations: [
                    { locale: 'de' },
                    { locale: 'es' },
                ],
                is_catalog: false,
            },
        },
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

describe('getshowStartPageVideo', () => {
    test('is true for mog project', () => {
        const _state = dotProp.set(state, 'archive.projectId', 'mog');

        expect(selectors.getShowStartPageVideo(_state)).toBeTruthy();
    });

    test('is false otherwise', () => {
        expect(selectors.getShowStartPageVideo(state)).toBeFalsy();
    });
});

test('getProjectTranslation gets project translation for current locale', () => {
    const actual = selectors.getProjectTranslation(state);
    const expected = state.data.projects[1].translations[0];
    expect(actual).toEqual(expected);
});

describe('getIsCampscapesProject', () => {
    test('is true when set to campscapes', () => {
        const _state = dotProp.set(state, 'archive.projectId', 'campscapes');

        expect(selectors.getIsCampscapesProject(_state)).toBeTruthy();
    });

    test('is false otherwise', () => {
        expect(selectors.getIsCampscapesProject(state)).toBeFalsy();
    });
});

describe('getIsCatalog', () => {
    test('returns is_catalog value', () => {
        expect(selectors.getIsCatalog(state)).toEqual(state.data.projects[1].is_catalog);
    });

    test('is false otherwise', () => {
        const _state = dotProp.set(state, 'data.projects.1.is_catalog', null);

        expect(selectors.getIsCatalog(_state)).toBe(false);
    });
});
