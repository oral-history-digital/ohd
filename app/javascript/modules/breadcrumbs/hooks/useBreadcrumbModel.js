import { useMemo } from 'react';

import { useAuthorization, useProjectAccessStatus } from 'modules/auth';
import {
    getCollections,
    getCurrentInterview,
    getCurrentUser,
    getInstitutions,
    getProjects,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { canShowFullInterviewTitle } from 'modules/interview-helpers';
import { useCurrentPage, useProject } from 'modules/routes';
import { useSelector } from 'react-redux';

import {
    buildCatalogTypeLabels,
    buildDefaultLabels,
    buildKnownItems,
    buildStaticPageLabels,
} from '../utils';

/**
 * Returns a breadcrumb model based on the current page classification.
 */
export function useBreadcrumbModel({ entityLabels = {}, labels = {} } = {}) {
    const currentPage = useCurrentPage();
    const { locale, t } = useI18n();
    const { project } = useProject();
    const { isAuthorized } = useAuthorization();
    const { projectAccessGranted } = useProjectAccessStatus(project || {});
    const currentUser = useSelector(getCurrentUser);
    const interview = useSelector(getCurrentInterview);
    const collections = useSelector(getCollections);
    const institutions = useSelector(getInstitutions);
    const projects = useSelector(getProjects);

    return useMemo(() => {
        const mergedLabels = {
            ...buildDefaultLabels(t),
            ...labels,
        };
        const staticPageLabels = buildStaticPageLabels(t);
        const catalogTypeLabels = buildCatalogTypeLabels(t);
        const canShowFullTitle = canShowFullInterviewTitle(
            interview,
            projectAccessGranted,
            currentUser,
            isAuthorized
        );

        const context = {
            labels: mergedLabels,
            staticPageLabels,
            catalogTypeLabels,
            entityLabels,
            project,
            interview,
            collections,
            institutions,
            projects,
            locale,
            canShowFullTitle,
        };

        if (!currentPage.isKnown || currentPage.pageType === 'unknown') {
            return {
                currentPage,
                items: [],
            };
        }

        return {
            currentPage,
            items: buildKnownItems(currentPage, context),
        };
    }, [
        collections,
        currentPage,
        currentUser,
        entityLabels,
        interview,
        isAuthorized,
        institutions,
        labels,
        locale,
        projects,
        projectAccessGranted,
        project,
        t,
    ]);
}
