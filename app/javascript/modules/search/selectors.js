import { createSelector } from 'reselect';

import { getArchiveId, getProjectId } from 'modules/archive';
import { NAME } from './constants';

const getState = state => state[NAME];

export const getRegistryEntriesSearch = createSelector(
    [getState, getProjectId],
    (search, projectId) => {
        if (projectId) {
            return search.registryEntries[projectId];
        } else {
            return null;
        }
    }
);

export const getShowRegistryEntriesSearchResults = createSelector(
    [getRegistryEntriesSearch],
    (registryEntriesSearch) => {
        return !!registryEntriesSearch?.showRegistryEntriesSearchResults;
    }
);

export const getIsRegistryEntrySearching = state => getState(state).isRegistryEntrySearching;

export const getPeopleQuery = state => getState(state).people.query;

export const getRegistryReferenceTypesQuery = state => getState(state).registry_reference_types.query;

export const getRegistryNameTypesQuery = state => getState(state).registry_name_types.query;

export const getContributionTypesQuery = state => getState(state).contribution_types.query;

export const getCollectionsQuery = state => getState(state).collections.query;

export const getLanguagesQuery = state => getState(state).languages.query;

export const getTranslationValuesQuery = state => getState(state).translation_values.query;

export const getInstitutionsQuery = state => getState(state).institutions.query;

export const getRolesQuery = state => getState(state).roles.query;

export const getPermissionsQuery = state => getState(state).permissions.query;

export const getTaskTypesQuery = state => getState(state).task_types.query;

export const getUsersQuery = state => getState(state).users.query;
