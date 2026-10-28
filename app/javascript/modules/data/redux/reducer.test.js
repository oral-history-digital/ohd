import { LOGOUT } from '../../user/action-types';
import {
    receiveData,
    receiveMutationData,
    replaceInstanceSettings,
} from './actions';
import { dataReducer } from './reducer';

test('replaces shared instance settings', () => {
    const instanceSettings = { breadcrumb_logo_url: '/logos/current.svg' };

    const state = dataReducer(
        { instance_settings: { breadcrumb_logo_url: '/logos/old.svg' } },
        replaceInstanceSettings(instanceSettings)
    );

    expect(state.instance_settings).toEqual(instanceSettings);
});

test('legacy project saves retain routing and refresh signals without merging their full bodies', () => {
    const base = dataReducer(undefined, {});
    const records = { 7: { id: 7, shortname: 'adg' } };
    const resources = { 7: { collections: { 4: { id: 4 } } } };
    const initial = {
        ...base,
        projects: { ...base.projects, records, resources },
    };
    const state = dataReducer(
        initial,
        receiveMutationData({
            data_type: 'projects',
            id: 7,
            reload_data_type: 'users',
            reload_id: 'current',
            data: {
                id: 7,
                shortname: 'adg',
                archive_domain: null,
                is_umbrella: false,
                contact_email: 'private@example.org',
                pseudo_available_locales: 'de,en',
                collections: { 99: { id: 99 } },
            },
        })
    );

    expect(state.projects.records).toBe(records);
    expect(state.projects.resources).toBe(resources);
    expect(state.projects.identities[7]).toEqual({
        id: 7,
        shortname: 'adg',
        archive_domain: null,
        is_umbrella: false,
    });
    expect(state.projects.generation).toBe(initial.projects.generation + 1);
    expect(JSON.stringify(state.projects)).not.toContain('private@example.org');
    expect(state.statuses.projects[7]).toMatch(/^fetched-/);
    expect(state.statuses.users.current).toMatch(/^reload-/);
});

test('newly created projects supply routing identity without marking their content as loaded', () => {
    const state = dataReducer(
        undefined,
        receiveMutationData({
            data_type: 'projects',
            id: 8,
            data: {
                id: 8,
                shortname: 'new',
                name: { de: 'Neu' },
                is_umbrella: false,
            },
        })
    );

    expect(state.projects.identities[8].shortname).toBe('new');
    expect(state.projects.records).toEqual({});
    expect(state.projects.requests).toEqual({});
    expect(state.projects.lists).toEqual({});
});

test('nested resource mutations work before their project resource map has been loaded', () => {
    const state = dataReducer(
        undefined,
        receiveMutationData({
            data_type: 'projects',
            id: 7,
            nested_data_type: 'collections',
            nested_id: 4,
            data: { id: 4, name: 'Collection' },
        })
    );

    expect(state.projects.resources).toEqual({
        7: { collections: { 4: { id: 4, name: 'Collection' } } },
    });
    expect(state.projects.records).toEqual({});
});

test.each([
    ['confirmed logout', { type: LOGOUT }],
    [
        'anonymous account response',
        receiveData({ data_type: 'users', id: 'current', data: null }),
    ],
])(
    '%s clears cached accounts without creating an empty current-user record',
    (_label, action) => {
        const base = dataReducer(undefined, {});
        const initial = {
            ...base,
            users: {
                current: { id: 2, webauthn_credentials: [] },
                3: { id: 3 },
            },
            statuses: { ...base.statuses, users: { current: 'reload' } },
        };
        const state = dataReducer(initial, action);
        expect(state.users).toEqual({ current: null });
        expect(state.statuses.users).not.toHaveProperty('current');
    }
);
