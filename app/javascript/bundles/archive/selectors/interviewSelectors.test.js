import { getInterviews, getCurrentInterview, getCurrentInterviewFetched,
    getContributorsFetched } from './interviewSelectors';

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

test('getInterviews retrieves all interviews', () => {
    expect(getInterviews(state)).toEqual(state.data.interviews);
});

test('getCurrentInterview retrieves current interview', () => {
    expect(getCurrentInterview(state)).toEqual(state.data.interviews.cd003);
});

test('getCurrentInterviewFetched retrieves if current interview has been fetched', () => {
    expect(getCurrentInterviewFetched(state)).toBe(true);
});

test('getContributorsFetched retrieves if contributors for current interview have been fetched', () => {
    expect(getContributorsFetched(state)).toBe(true);
});
