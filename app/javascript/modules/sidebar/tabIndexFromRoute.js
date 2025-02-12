import { matchPath } from 'react-router-dom';

import * as indexes from './constants';

export default function tabIndexFromRoute(pathBase, pathname) {
    let index;

    if (matchPath(`${pathBase}/not_found`, pathname)) {
        index = indexes.INDEX_NONE;
    } else if (matchPath(`${pathBase}/users`, pathname)) {
        index = indexes.INDEX_ADMINISTRATION;
    } else if (matchPath(`${pathBase}/searches/archive`, pathname)) {
        index = indexes.INDEX_SEARCH;
    } else if (matchPath(`${pathBase}/catalog/*`, pathname)) {
        index = indexes.INDEX_CATALOG;
    } else if (matchPath(`${pathBase}/interviews/new`, pathname)) {
        index = indexes.INDEX_INDEXING;
    } else if (matchPath(`${pathBase}/interviews/:archiveId`, pathname)) {
        index = indexes.INDEX_INTERVIEW;
    } else if (matchPath(`${pathBase}/registry_entries`, pathname)) {
        index = indexes.INDEX_REGISTRY_ENTRIES;
    } else if (matchPath(`${pathBase}/searches/map`, pathname)) {
        index = indexes.INDEX_MAP;
    } else if (matchPath(`${pathBase}/uploads/new`, pathname)) {
        index = indexes.INDEX_INDEXING;
    } else if (matchPath(`${pathBase}/people`, pathname)) {
        index = indexes.INDEX_INDEXING;
    } else if (matchPath(`${pathBase}/registry_reference_types`, pathname)) {
        index = indexes.INDEX_INDEXING;
    } else if (matchPath(`${pathBase}/registry_name_types`, pathname)) {
        index = indexes.INDEX_INDEXING;
    } else if (matchPath(`${pathBase}/contribution_types`, pathname)) {
        index = indexes.INDEX_INDEXING;
    } else if (matchPath(`${pathBase}/collections`, pathname)) {
        index = indexes.INDEX_INDEXING;
    } else if (matchPath(`${pathBase}/languages`, pathname)) {
        index = indexes.INDEX_INDEXING;
    } else if (matchPath(`${pathBase}/project/edit-info`, pathname)) {
        index = indexes.INDEX_PROJECT_ACCESS;
    } else if (matchPath(`${pathBase}/project/edit-config`, pathname)) {
        index = indexes.INDEX_PROJECT_ACCESS;
    } else if (matchPath(`${pathBase}/project/edit-display`, pathname)) {
        index = indexes.INDEX_PROJECT_ACCESS;
    } else if (matchPath(`${pathBase}/metadata_fields`, pathname)) {
        index = indexes.INDEX_PROJECT_ACCESS;
    } else if (matchPath(`${pathBase}/roles`, pathname)) {
        index = indexes.INDEX_PROJECT_ACCESS;
    } else if (matchPath(`${pathBase}/permissions`, pathname)) {
        index = indexes.INDEX_PROJECT_ACCESS;
    } else if (matchPath(`${pathBase}/task_types`, pathname)) {
        index = indexes.INDEX_PROJECT_ACCESS;
    } else if (matchPath(`${pathBase}/event_types`, pathname)) {
        index = indexes.INDEX_PROJECT_ACCESS;
    } else if (matchPath(`${pathBase}/translation_values`, pathname)) {
        index = indexes.INDEX_PROJECT_ACCESS;
    } else if (matchPath(`${pathBase}/projects`, pathname)) {
        index = indexes.INDEX_PROJECTS;
    } else if (matchPath(`${pathBase}/institutions`, pathname)) {
        index = indexes.INDEX_INSTITUTIONS;
    } else if (matchPath(`${pathBase}/help_texts`, pathname)) {
        index = indexes.INDEX_HELP_TEXTS;
    } else if (matchPath(`${pathBase}`, pathname)) {
        index = indexes.INDEX_NONE;
    } else {
        index = indexes.INDEX_NONE;
    }

    return index;
}
