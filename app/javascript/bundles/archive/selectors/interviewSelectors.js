import { getArchiveId, getContributionTypes } from './archiveSelectors';
import { getCurrentAccount, getPeople, getPeopleStatus } from './dataSelectors';

const getInterviews = state => state.data.interviews;

export const getCurrentInterview = state => {
    const interviews = getInterviews(state);
    const archiveId = getArchiveId(state);
    return interviews && interviews[archiveId];
};

export const getContributorsFetched = state => {
    const interview = getCurrentInterview(state);
    const contributionTypes = getContributionTypes(state);
    const peopleStatus = getPeopleStatus(state);

    if (
        interview &&
        contributionTypes &&
        (
            (peopleStatus[`contributors_for_interview_${interview.id}`] && peopleStatus[`contributors_for_interview_${interview.id}`].split('-')[0] === 'fetched') ||
            (peopleStatus.all && peopleStatus.all.split('-')[0] === 'fetched')
        )
    ) {
        return true;
    } else {
        return false;
    }
};
