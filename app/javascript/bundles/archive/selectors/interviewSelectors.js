import { getArchiveId } from './archiveSelectors';
import { getData, getPeopleStatus } from './dataSelectors';

export const getInterviews = state => getData(state).interviews;

export const getCurrentInterview = state => {
    const interviews = getInterviews(state);
    const archiveId = getArchiveId(state);
    return interviews && interviews[archiveId];
};

export const getCurrentInterviewFetched = state => {
    const currentInterview = getCurrentInterview(state);

    return !(Object.is(currentInterview, undefined) || Object.is(currentInterview, null));
};

export const getContributorsFetched = state => {
    const interview = getCurrentInterview(state);
    const peopleStatus = getPeopleStatus(state);

    if (
        interview &&
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
