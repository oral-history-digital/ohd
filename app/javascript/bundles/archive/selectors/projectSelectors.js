import { getProjectId } from './archiveSelectors';

export const getShowFeaturedInterviews = state => {
    const projectId = getProjectId(state);

    // TODO: put to project-conf
    if (projectId === 'mog' || projectId === 'campscapes') {
        return false;
    }

    return true;
};

export const getShowStartpageVideo = state => {
    const projectId = getProjectId(state);

    // TODO: put to project-conf
    return (projectId === 'mog');
};
