import { useMemo } from 'react';

import { useAuthorization, useProjectAccessStatus } from 'modules/auth';
import {
    getCurrentInterview,
    getCurrentUser,
    getUsersStatus,
    useGetCollection,
    useGetInstitution,
    useGetProject,
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
    const archiveProjectId = catalogType === 'archives' ? catalogItemId : null;

    const { project: archiveProject } = useGetProject(archiveProjectId, {
        lite: true,
    });
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
            archiveProject,
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
        archiveProject,
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
