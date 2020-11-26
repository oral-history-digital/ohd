import { getContributionTypes } from './archiveSelectors';
import { getCurrentInterview, getContributorsFetched } from './interviewSelectors';

const state = {
    archive: {
        archiveId: 'cd003',
    },
    data: {
        interviews: {
            cd003: {
                id: 22,
                type: 'Interview',
            },
        },
        statuses: {
            people: {
                contributors_for_interview_22: 'fetched',
            },
        },
    },
};

test('getCurrentInterview retrieves current interview', () => {
    expect(getCurrentInterview(state)).toStrictEqual({ id: 22, type: 'Interview' });
});

test('getContributorsFetched retrieves if contributors for current interview have been fetched', () => {
    expect(getContributorsFetched(state)).toBe(true);
});
