/* global railsMode */
import { OHD_DOMAINS } from 'modules/constants';

export function normalizeDomain(value) {
    return (value || '').toString().trim().replace(/\/+$/, '');
}

export function findProjectByDomain(
    projects,
    currentOrigin = window.location.origin,
    ohdDomain = OHD_DOMAINS[railsMode]
) {
    const normalizedOrigin = normalizeDomain(currentOrigin);

    if (!projects) {
        return undefined;
    }

    const matchedProject = Object.values(projects).find((project) => {
        return normalizeDomain(project?.archive_domain) === normalizedOrigin;
    });

    if (matchedProject) {
        return matchedProject;
    }

    if (normalizedOrigin === normalizeDomain(ohdDomain)) {
        return Object.values(projects).find((project) => {
            return project?.shortname === 'ohd';
        });
    }

    return undefined;
}
