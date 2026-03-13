import { getCatalogCollectionParentArchive } from './entities';
import {
    getArchiveLabel,
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
        project,
        interview,
        collections,
        locale,
        canShowFullTitle,
    } = context;
    const { params, pathBase } = currentPage;

    const archiveLabel =
        entityLabels.archive || getArchiveLabel(project, locale) || labels.home;
    const interviewLabel =
        entityLabels.interview ||
        getInterviewLabel(interview, locale, canShowFullTitle) ||
        params.archiveId ||
        labels.interview_detail;
    const collectionLabel =
        entityLabels.collection ||
        getInterviewCollectionLabel(interview, collections, locale);

    const items = [
        {
            key: 'archive',
            label: archiveLabel,
            to: pathBase,
            isCurrent: false,
        },
    ];

    if (collectionLabel) {
        items.push({
            key: 'collection',
            label: collectionLabel,
            to: null,
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
    const catalogType = params.catalogType || 'root';
    const catalogBasePath = joinPath(pathBase, '/catalog');

    const items = [
        {
            key: 'home',
            label: labels.home,
            to: pathBase,
            isCurrent: false,
        },
        {
            key: 'catalog',
            label: labels.catalog_page,
            to: catalogBasePath,
            isCurrent: catalogType === 'root',
        },
    ];

    if (params.id) {
        const parentArchive =
            catalogType === 'collections'
                ? getCatalogCollectionParentArchive(params.id, context)
                : null;

        if (parentArchive) {
            items.push({
                key: `catalog_archive_${parentArchive.archiveId}`,
                label: parentArchive.archiveLabel,
                to: joinPath(
                    catalogBasePath,
                    `/archives/${parentArchive.archiveId}`
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
    const { pageType, params, pathBase } = currentPage;

    if (pageType === 'project_startpage') {
        return [
            {
                key: 'home',
                label: labels.home,
                to: pathBase,
                isCurrent: true,
            },
        ];
    }

    if (pageType === 'catalog_page') {
        return buildCatalogItems(currentPage, labels, entityLabels, context);
    }

    if (pageType === 'interview_detail') {
        return buildInterviewItems(currentPage, context);
    }

    const pagePathByType = {
        interview_detail: params.archiveId
            ? joinPath(pathBase, `/interviews/${params.archiveId}`)
            : null,
        collections: joinPath(pathBase, '/collections'),
        search_archive: joinPath(pathBase, '/searches/archive'),
        search_map: joinPath(pathBase, '/searches/map'),
        registry_entries: joinPath(pathBase, '/registry_entries'),
        user_page: joinPath(pathBase, '/users'),
        project_admin_page: joinPath(pathBase, '/project/edit-config'),
        static_text_page: params.staticPageCode
            ? joinPath(pathBase, `/${params.staticPageCode}`)
            : null,
    };

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
            key: 'home',
            label: labels.home,
            to: pathBase,
            isCurrent: false,
        },
        {
            key: pageType,
            label: currentLabel,
            to: pagePathByType[pageType] || null,
            isCurrent: true,
            loading: pageType === 'interview_detail' && !entityLabels.interview,
        },
    ];
}
