import { createSelector } from 'reselect';
import { getProjectId, getLocale } from './archiveSelectors';
import { getCurrentProject } from './dataSelectors';

export const getShowFeaturedInterviews = state => {
    const projectId = getProjectId(state);

    // TODO: put to project-conf
    if (projectId === 'mog' || projectId === 'campscapes') {
        return false;
    }

    return true;
};

export const getShowStartPageVideo = state => {
    const projectId = getProjectId(state);

    // TODO: put to project-conf
    return projectId === 'mog';
};

export const getProjectTranslation = createSelector(
    [getLocale, getCurrentProject],
    (locale, currentProject) => {
        return currentProject.translations.find(t => t.locale === locale);
    }
);

export const getIsCampscapesProject = state => {
    const projectId = getProjectId(state);

    return projectId === 'campscapes';
};
