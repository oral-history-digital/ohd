import {
    getData,
    getCollections,
    getInterviews,
    getLanguages,
    getNormDataProviders,
    getPermissions,
    getProjects,
    getRandomFeaturedInterviews,
    getRegistryEntries,
    getSegments,
    getStatuses,
    getTasks,
    getUsers,
} from './baseSelectors';
import { state } from './stateFixture';

test('getData gets data object', () => {
    expect(getData(state)).toEqual(state.data);
});

test('getCollections gets collections object', () => {
    expect(getCollections(state)).toEqual(state.data.collections);
});

test('getInterviews retrieves all interviews', () => {
    expect(getInterviews(state)).toEqual(state.data.interviews);
});

test('getLanguages gets languages object', () => {
    expect(getLanguages(state)).toEqual(state.data.languages);
});

test('getNormDataProviders gets norm data providers object', () => {
    expect(getNormDataProviders(state)).toEqual(state.data.norm_data_providers);
});

test('getPermissions gets permissions object', () => {
    expect(getPermissions(state)).toEqual(state.data.permissions);
});

test('getProjects gets projects object', () => {
    expect(getProjects(state)).toEqual(state.data.projects);
});

test('getRandomFeaturedInterviews gets featured interviews object', () => {
    expect(getRandomFeaturedInterviews(state)).toEqual(
        state.data.random_featured_interviews
    );
});

test('getRegistryEntries gets registry entries object', () => {
    expect(getRegistryEntries(state)).toEqual(state.data.registry_entries);
});

test('getSegments gets segments object', () => {
    expect(getSegments(state)).toEqual(state.data.segments);
});

test('getStatuses gets statuses object', () => {
    expect(getStatuses(state)).toEqual(state.data.statuses);
});

test('getTasks gets tasks object', () => {
    expect(getTasks(state)).toEqual(state.data.tasks);
});

test('getUsers gets users object', () => {
    expect(getUsers(state)).toEqual(state.data.users);
});
