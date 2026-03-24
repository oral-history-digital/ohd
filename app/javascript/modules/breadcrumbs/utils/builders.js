import { getCatalogCollectionParentProject } from './entities';
import {
    getCatalogItemLabel,
    getInterviewCollectionLabel,
    getInterviewLabel,
} from './labels';
import { humanizeSegment, joinPath } from './path';

/**
 * Builds breadcrumb items for interview pages.
 */
export function buildInterviewItems(currentPage, context) {
    const {
        labels,
        entityLabels,
        interview,
        collections,
        locale,
        canShowFullTitle,
    } = context;
    const { params, pathBase } = currentPage;

    const collectionLabel =
        entityLabels.collection ||
        getInterviewCollectionLabel(interview, collections, locale);
    const interviewLabel =
        entityLabels.interview ||
        getInterviewLabel(interview, locale, canShowFullTitle) ||
        params.archiveId ||
        labels.interview_detail;

    // Start empty (Project Home will be added globally for non-OHD projects)
    const items = [];

    // If the interview belongs to a collection, include that as an intermediate breadcrumb item
    if (collectionLabel) {
        items.push({
            key: 'collection',
            label: collectionLabel,
            to: joinPath(
                pathBase,
                `/searches/archive?collection_id[]=${interview.collection_id}&sort=random`
            ),
            isCurrent: false,
        });
    } else {
        // If no collection, add an item linking the search page for the project as a fallback
        items.push({
            key: 'search_archive',
            label: labels.search_archive,
            to: joinPath(pathBase, '/searches/archive'),
            isCurrent: false,
        });
    }

    items.push({
        key: 'interview',
        label: interviewLabel,
        to: params.archiveId
            ? joinPath(pathBase, `/interviews/${params.archiveId}`)
            : null,
        isCurrent: true,
        loading: !entityLabels.interview && !interview,
    });

    return items;
}

/**
 * Builds breadcrumb items for catalog pages.
 */
export function buildCatalogItems(currentPage, labels, entityLabels, context) {
    const { params, pathBase } = currentPage;
    const { catalogTypeLabels } = context;
    const catalogType = params.catalogType || 'root';
    const catalogBasePath = joinPath(pathBase, '/catalog');
    const isInstitutionsPage = catalogType === 'institutions';
    const isInstitutionsIndexPage = isInstitutionsPage && !params.id;
    const catalogParentLabel = isInstitutionsPage
        ? catalogTypeLabels.institutions || labels.catalog_page
        : labels.catalog_page;
    const catalogParentPath = isInstitutionsPage
        ? joinPath(catalogBasePath, '/institutions')
        : catalogBasePath;

    const items = [
        {
            key: 'catalog',
            label: catalogParentLabel,
            to: catalogParentPath,
            isCurrent: catalogType === 'root' || isInstitutionsIndexPage,
        },
    ];

    if (params.id) {
        const parentProject =
            catalogType === 'collections'
                ? getCatalogCollectionParentProject(params.id, context)
                : null;

        if (parentProject) {
            items.push({
                key: `catalog_archive_${parentProject.projectId}`,
                label: parentProject.projectLabel,
                to: joinPath(
                    catalogBasePath,
                    `/archives/${parentProject.projectId}`
                ),
                isCurrent: false,
            });
        }

        const resolvedLabel = getCatalogItemLabel(
            catalogType,
            params.id,
            context
        );
        const itemLabel =
            entityLabels[catalogType] ||
            entityLabels.catalogItem ||
            resolvedLabel ||
            params.id;
        items.push({
            key: `catalog_item_${params.id}`,
            label: itemLabel,
            to: null,
            isCurrent: true,
            loading:
                !entityLabels[catalogType] &&
                !entityLabels.catalogItem &&
                !resolvedLabel,
        });
    }

    return items;
}

/**
 * Builds breadcrumb items for non-catalog known page types.
 */
export function buildKnownItems(currentPage, context) {
    const { labels, entityLabels, staticPageLabels } = context;
    const { pageType, subtype, params, pathBase } = currentPage;

    if (pageType === 'project_startpage') {
        return [];
    }

    if (pageType === 'catalog_page') {
        return buildCatalogItems(currentPage, labels, entityLabels, context);
    }

    if (pageType === 'interview_detail') {
        return buildInterviewItems(currentPage, context);
    }

    const projectParentPagePaths = {
        search_archive: '/searches/archive',
        search_map: '/searches/map',
        register: '/register',
        register_page: '/register',
    };

    if (projectParentPagePaths[pageType]) {
        const collectionFilterId = params.collectionId;
        // Only collection-filtered archive searches should replace the generic label.
        const filteredCollectionLabel =
            pageType === 'search_archive' &&
            subtype === 'collection_search' &&
            collectionFilterId
                ? getCatalogItemLabel(
                      'collections',
                      collectionFilterId,
                      context
                  )
                : null;

        const currentItem = {
            key: pageType,
            label:
                filteredCollectionLabel ||
                labels[pageType] ||
                humanizeSegment(pageType),
            to: joinPath(pathBase, projectParentPagePaths[pageType]),
            isCurrent: true,
            loading: false,
        };

        return [currentItem];
    }

    const pagePathByType = {
        interview_detail: params.archiveId
            ? joinPath(pathBase, `/interviews/${params.archiveId}`)
            : null,
        collections: joinPath(pathBase, '/collections'),
        search_archive: joinPath(pathBase, '/searches/archive'),
        search_map: joinPath(pathBase, '/searches/map'),
        register: joinPath(pathBase, '/register'),
        register_page: joinPath(pathBase, '/register'),
        registry_entries: joinPath(pathBase, '/registry_entries'),
        user_page: joinPath(pathBase, '/users'),
        project_admin_page: joinPath(pathBase, '/project/edit-config'),
        static_text_page: params.staticPageCode
            ? joinPath(pathBase, `/${params.staticPageCode}`)
            : null,
    };

    // Generic fallback for known pages that do not need dedicated branch logic.
    let currentLabel = labels[pageType] || humanizeSegment(pageType);

    if (pageType === 'interview_detail') {
        currentLabel = entityLabels.interview || currentLabel;
    }

    if (pageType === 'static_text_page') {
        currentLabel =
            staticPageLabels[params.staticPageCode] ||
            humanizeSegment(params.staticPageCode) ||
            currentLabel;
    }

    return [
        {
            key: pageType,
            label: currentLabel,
            to: pagePathByType[pageType] || null,
            isCurrent: true,
            loading: pageType === 'interview_detail' && !entityLabels.interview,
        },
    ];
}
