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
