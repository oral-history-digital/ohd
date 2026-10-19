import { useMemo } from 'react';

import { useAuthorization, useProjectAccessStatus } from 'modules/auth';
import {
    getCurrentInterview,
    getCurrentUser,
    getUsersStatus,
    makeProjectSelector,
    useGetCollection,
    useGetInstitution,
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
 * Builds breadcrumbs for the current route.
 * On catalog project detail pages, reads the project name from Redux;
 * the detail page loads missing project data.
 *
 * @param {Object} [options={}] - Label overrides.
 * @param {Object} [options.entityLabels={}] - Labels for individual records.
 * @param {Object} [options.labels={}] - Overrides for standard breadcrumb labels.
 * @returns {{currentPage: Object, items: Object[]}} Route context and breadcrumb items.
 */
export function useBreadcrumbModel({ entityLabels = {}, labels = {} } = {}) {
    const currentPage = useCurrentPage();
    const { locale, t } = useI18n();
    const { project } = useProject();
    const { isAuthorized } = useAuthorization();
    const { projectAccessGranted } = useProjectAccessStatus(project || {});
    const currentUser = useSelector(getCurrentUser);
    const usersStatus = useSelector(getUsersStatus);
    const interview = useSelector(getCurrentInterview);

    const params = currentPage?.params || {};
    const catalogType = params.catalogType;
    const catalogItemId = params.id;
    const collectionId =
        (catalogType === 'collections' && catalogItemId) ||
        params.collectionId ||
        interview?.collection_id ||
        null;
    const institutionId = catalogType === 'institutions' ? catalogItemId : null;
    const catalogProjectId = catalogType === 'archives' ? catalogItemId : null;

    const selectCatalogProject = useMemo(makeProjectSelector, []);
    const catalogProject = useSelector((state) =>
        selectCatalogProject(state, catalogProjectId, locale)
    );
    const { collection } = useGetCollection(collectionId);
    const { institution } = useGetInstitution(institutionId);

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
            currentUser,
            usersStatus,
            interview,
            collection,
            institution,
            catalogProject,
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
        catalogProject,
        collection,
        currentPage,
        currentUser,
        entityLabels,
        interview,
        isAuthorized,
        institution,
        labels,
        locale,
        usersStatus,
        projectAccessGranted,
        project,
        t,
    ]);
}
