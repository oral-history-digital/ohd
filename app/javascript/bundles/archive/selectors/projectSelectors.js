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
    return (projectId === 'mog');
};

export const getProjectTranslation = state => {
    const locale = getLocale(state);
    const project = getCurrentProject(state);

    const projectTranslation = project.translations.find(t => t.locale === locale);
    return projectTranslation;
};
