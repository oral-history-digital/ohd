import { createSelector } from 'reselect';

import { getProjectId, getLocale } from 'modules/archive';
import { getCurrentProject } from './dataSelectors';

export const DEFAULT_MAP_SECTION = {
    id: 0,
    type: 'MapSection',
    name: 'default',
    corner1_lat: 51.50939,  // London
    corner1_lon: -0.11832,
    corner2_lat: 44.433333,  // Bucarest
    corner2_lon: 26.1,
};

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
        const selectedLocale = currentProject.available_locales.indexOf(locale) === -1 ? currentProject.default_locale : locale
        return currentProject?.translations_attributes.find(t => t.locale === selectedLocale);
    }
);

export const getIsCampscapesProject = state => {
    const projectId = getProjectId(state);

    return projectId === 'campscapes';
};

export const getIsCatalog = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return (currentProject?.is_catalog === true);
    }
);

export const getMapSections = createSelector(
    [getCurrentProject],
    currentProject => {
        if (!currentProject.map_sections) {
            return [DEFAULT_MAP_SECTION];
        }

        const sections = Object.values(currentProject.map_sections);

        if (sections.length === 0) {
            return [DEFAULT_MAP_SECTION];
        }

        return sections.sort((a, b) => a.order - b.order);
    }
);
