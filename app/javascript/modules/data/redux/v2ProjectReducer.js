import { AUTH_ERROR, LOGGED_IN, LOGOUT } from 'modules/user/action-types';

import {
    RECEIVE_DATA,
    RECEIVE_ERROR,
    REMOVE_DATA,
    REPLACE_INSTANCE_SETTINGS,
    REQUEST_DATA,
    UPDATE_DATA,
} from './action-types';

const localizedFields = [
    'name',
    'display_name',
    'introduction',
    'logo',
    'institutions',
    'collection_preview',
];
const relatedResources = [
    'projects',
    'collections',
    'interviews',
    'institutions',
    'institution_projects',
    'languages',
    'interview_languages',
    'logos',
    'roles',
    'permissions',
    'user_roles',
    'user_projects',
    'role_permissions',
    'instance_settings',
];

/**
 * @typedef {Object} V2ProjectState
 * @property {Object<string, Object>} records - Locale-independent fields by project ID.
 * @property {Object} translations - Display values by project ID and requested locale (may use
 * fallback locale); stored translation records are reserved for a later editor migration.
 * @property {Object<string, Object>} lists - Ordered IDs and pagination by request key.
 * @property {Object<string, Object>} requests - Status and error by request key.
 * @property {number} generation - Counter used to reject responses from before invalidation.
 * @property {?string} context - Access settings shared by the cached project data.
 */

/**
 * Creates empty v2 project state for an access context and cache generation.
 *
 * @param {number} [generation=0] - Counter retained or increased by the caller.
 * @param {?string} [context=null] - Serialized access settings, or null before fetching.
 * @returns {V2ProjectState} Empty records, translations, lists, and request status.
 */
function emptyProjects(generation = 0, context = null) {
    return {
        records: {},
        translations: { display: {}, stored: {} },
        lists: {},
        requests: {},
        generation,
        context,
    };
}

/**
 * Stores v2 project lists without changing legacy project records.
 * Merges received fields while preserving omitted fields and other locales.
 * Access changes and relevant mutations clear the cache and invalidate in-flight
 * responses. State is created only when the first v2 project request starts.
 *
 * @param {V2ProjectState|undefined} state - Existing v2 project state, if initialized.
 * @param {Object} action - V2 request action or a legacy access/mutation action.
 * @returns {V2ProjectState|undefined} Updated state, or the original value for ignored actions.
 */
export function reduceV2Projects(state, action) {
    // Legacy mutations and access changes invalidate v2 data without merging legacy responses.
    if (action.apiVersion !== 2) {
        if (!state) return state;
        const accountChanged =
            action.dataType === 'users' &&
            String(action.id) === 'current' &&
            [RECEIVE_DATA, REMOVE_DATA].includes(action.type);
        const recordsChanged =
            relatedResources.includes(
                action.mutationResource || action.dataType
            ) &&
            ([REMOVE_DATA, UPDATE_DATA].includes(action.type) ||
                (action.mutation && action.type === RECEIVE_DATA));
        if (
            accountChanged ||
            recordsChanged ||
            action.type === REPLACE_INSTANCE_SETTINGS ||
            [LOGGED_IN, LOGOUT, AUTH_ERROR].includes(action.type)
        )
            return emptyProjects(state.generation + 1);
        return state;
    }
    if (action.dataType !== 'projects') return state;
    state ||= emptyProjects();
    if (action.generation !== state.generation) return state;
    if (action.type === REQUEST_DATA) {
        if (state.context !== action.context)
            state = emptyProjects(state.generation, action.context);
        return {
            ...state,
            requests: {
                ...state.requests,
                [action.key]: { status: 'pending', error: null },
            },
        };
    }
    // An access change or mutation may have invalidated this response in flight.
    if (
        state.context !== action.context ||
        state.requests[action.key]?.status !== 'pending'
    )
        return state;
    if (action.type === RECEIVE_ERROR)
        return {
            ...state,
            requests: {
                ...state.requests,
                [action.key]: { status: 'failed', error: action.error },
            },
        };
    if (action.type !== RECEIVE_DATA) return state;

    const records = { ...state.records };
    const display = { ...state.translations.display };
    for (const project of action.data.data) {
        const stable = {};
        const localized = {};
        for (const [field, value] of Object.entries(project))
            (localizedFields.includes(field) ? localized : stable)[field] =
                value;
        records[project.id] = { ...records[project.id], ...stable };
        display[project.id] = {
            ...display[project.id],
            [action.locale]: {
                ...display[project.id]?.[action.locale],
                ...localized,
            },
        };
    }
    return {
        ...state,
        records,
        translations: { ...state.translations, display },
        lists: {
            ...state.lists,
            [action.key]: {
                ids: action.data.data.map(({ id }) => id),
                pagination: action.data.pagination,
            },
        },
        requests: {
            ...state.requests,
            [action.key]: { status: 'succeeded', error: null },
        },
    };
}
