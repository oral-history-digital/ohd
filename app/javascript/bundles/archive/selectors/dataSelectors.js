import { getProjectId } from './archiveSelectors';

export const getData = state => state.data;

export const getLanguages = state => getData(state).languages;

export const getPeople = state => getData(state).people;

export const getStatuses = state => getData(state).statuses;

export const getPeopleStatus = state => getStatuses(state).people;

export const getCollections = state => getData(state).collections;

export const getProjects = state => getData(state).projects;

export const getCurrentAccount = state => getData(state).accounts.current;

export const get = (state, dataType, id) => getData(state)[dataType][id];

export function getCurrentProject(state) {
    const currentProjectId = getProjectId(state);
    const projects = getProjects(state);

    const currentProject = Object.values(projects)
        .find(project => project.identifier === currentProjectId);

    return currentProject || null;
}
