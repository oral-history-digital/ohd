/**
 * Base selectors to get data from the redux state
 * These selectors do not use reselect and are used by other selectors
 * that do use reselect.
 */

export const getData = (state) => state.data;

export const getCollections = (state) => getData(state).collections;

export const getInstitutions = (state) => getData(state).institutions;

export const getInterviews = (state) => getData(state).interviews;

export const getLanguages = (state) => getData(state).languages;

export const getNormDataProviders = (state) =>
    getData(state).norm_data_providers;

export const getPermissions = (state) => getData(state).permissions;

export const getProjects = (state) => getData(state).projects;

export const getRandomFeaturedInterviews = (state) =>
    getData(state).random_featured_interviews;

export const getRegistryEntries = (state) => getData(state).registry_entries;

export const getSegments = (state) => getData(state).segments;

export const getStatuses = (state) => getData(state).statuses;

export const getTasks = (state) => getData(state).tasks;

export const getTranslationValues = (state) =>
    getData(state).translation_values;

export const getUsers = (state) => getData(state).users;
