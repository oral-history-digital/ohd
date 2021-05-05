import dotProp from 'dot-prop-immutable';

import getGroupedContributions from './getGroupedContributions';

const interviewee = {
    id: 0,
    contribution_type: 'interviewee',
    interview_id: 22,
};

const sound1 = {
    id: 1,
    contribution_type: 'sound',
    interview_id: 22,
};

const sound2 = {
    id: 2,
    contribution_type: 'sound',
    interview_id: 22,
};

const interviewer = {
    id: 3,
    contribution_type: 'interviewer',
    interview_id: 22,
};

const qualityManager = {
    id: 4,
    contribution_type: 'quality_manager_transcription',
    interview_id: 22,
};

const state = {
    archive: {
        archiveId: 'cd003',
        editView: false,
    },
    data: {
        interviews: {
            cd003: {
                id: 22,
                type: 'Interview',
                contributions: [
                    interviewee,
                    sound1,
                    qualityManager,
                    sound2,
                    interviewer,
                ],
            },
        },
        contribution_types: {
            1: {id: 1, project_id: 1, code: 'cinematographer', order: 2, use_in_details_view: true},
            //2: {id: 2, project_id: 1, code: 'interviewee', order: false, use_in_details_view: false},
            3: {id: 3, project_id: 1, code: 'interviewer', order: 1, use_in_details_view: true},
            4: {id: 4, project_id: 1, code: 'other_attender', order: 5, use_in_details_view: true},
            5: {id: 5, project_id: 1, code: 'producer', order: 4, use_in_details_view: true},
            6: {id: 6, project_id: 1, code: 'research', order: 10, use_in_details_view: true},
            7: {id: 7, project_id: 1, code: 'segmentator', order: 8, use_in_details_view: true},
            8: {id: 8, project_id: 1, code: 'sound', order: 3, use_in_details_view: true},
            9: {id: 9, project_id: 1, code: 'transcriptor', order: 6, use_in_details_view: true},
            10: {id: 10, project_id: 1, code: 'translator', order: 7, use_in_details_view: true},
            11: {id: 11, project_id: false, code: 'proofreader', order: 9, use_in_details_view: true},
            12: {id: 12, project_id: false, code: 'quality_manager_interviewing', order: 11, use_in_details_view: false},
            13: {id: 13, project_id: false, code: 'quality_manager_transcription', order: 12, use_in_details_view: false},
            14: {id: 14, project_id: false, code: 'quality_manager_translation', order: 13, use_in_details_view: false},
            15: {id: 15, project_id: false, code: 'quality_manager_research', order: 14, use_in_details_view: false}
        }
    },
};

describe('getGroupedContributions', () => {
    test('returns contributions of current interview, ordered and grouped by type, without interviewee', () => {
        const actual = getGroupedContributions(state);
        const expected = [
            {
                type: 'interviewer',
                contributions: [interviewer],
            },
            {
                type: 'sound',
                contributions: [sound1, sound2],
            },
        ];
        expect(actual).toEqual(expected);
    });

    test('also returns quality managers when edit view is true', () => {
        const _state = dotProp.set(state, 'archive.editView', true);

        const actual = getGroupedContributions(_state);
        const expected = [
            {
                type: 'interviewer',
                contributions: [interviewer],
            },
            {
                type: 'sound',
                contributions: [sound1, sound2],
            },
            {
                type: 'quality_manager_transcription',
                contributions: [qualityManager],
            },
        ];
        expect(actual).toEqual(expected);
    });
});
