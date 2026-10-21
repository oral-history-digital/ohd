import { AUTH_ERROR, LOGGED_IN, LOGOUT } from 'modules/user/action-types';

import {
    RECEIVE_DATA,
    RECEIVE_ERROR,
    REMOVE_DATA,
    REPLACE_INSTANCE_SETTINGS,
    REQUEST_DATA,
    UPDATE_DATA,
} from './action-types';
import { localizedProjectFields, projectEditFields } from './projectRecords';

const relatedResources = [
    'projects',
    'collections',
    'interviews',
    'institutions',
    'institution_projects',
    'languages',
    'interview_languages',
    'logos',
    'sponsor_logos',
    'media_streams',
    'external_links',
    'access_configs',
    'metadata_fields',
    'texts',
    'map_sections',
    'roles',
    'permissions',
    'user_roles',
    'user_projects',
    'role_permissions',
    'instance_settings',
    'affiliates',
    'cooperation_partners',
    'leaders',
    'managers',
    'funders',
    'people',
    'contributions',
    'contribution_types',
    'registry_entries',
    'registry_names',
    'registry_name_types',
    'registry_hierarchies',
    'registry_references',
    'registry_reference_types',
    'event_types',
];

/**
 * @typedef {Object} V2ProjectState
 * @property {Object<string, Object>} records - Shared fields by project ID, with
 * locale-independent editing and email-preview values under records[id].edit.
 * @property {Object} translations - Localized values under display[id][locale] and
 * edit[id][locale]. stored[id] holds project translation arrays without fallback.
 * @property {Object<string, Object>} lists - Ordered IDs and pagination by request key.
 * @property {Object<string, Object>} requests - Status/error by request key; detail results also retain the returned project ID.
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
        translations: { display: {}, edit: {}, stored: {} },
        lists: {},
        requests: {},
        generation,
        context,
    };
}

/**
 * Stores project lists and details without changing legacy project records.
 * Merges shared fields while preserving omitted fields and other locales. Editing
 * additions and preview contact data stay separate from ordinary display reads.
 * Access changes and relevant mutations clear the cache and invalidate in-flight
 * responses. Queued-job acknowledgements retain cached project data.
 * State is created only when the first v2 project request starts.
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
                // "processing" acknowledges queued work; keep project views mounted.
                (action.mutation &&
                    action.type === RECEIVE_DATA &&
                    action.msg !== 'processing'));
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
                [action.key]: {
                    ...state.requests[action.key],
                    status: 'pending',
                    error: null,
                },
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
    const edit = { ...state.translations.edit };
    const stored = { ...state.translations.stored };
    const editable =
        action.profile === 'edit'
            ? projectEditFields(action.include)
            : action.include?.includes('email_preview')
              ? ['contact_email']
              : [];
    const received = action.single ? [action.data.data] : action.data.data;
    for (const project of received) {
        const stable = {};
        const localized = {};
        const stableEdit = {};
        const localizedEdit = {};
        for (const [field, value] of Object.entries(project)) {
            if (field === 'translations') {
                if (action.profile === 'edit') stored[project.id] = value;
                continue;
            }
            const isLocalized = localizedProjectFields.includes(field);
            if (editable.includes(field))
                (isLocalized ? localizedEdit : stableEdit)[field] = value;
            else (isLocalized ? localized : stable)[field] = value;
        }
        records[project.id] = { ...records[project.id], ...stable };
        display[project.id] = {
            ...display[project.id],
            [action.locale]: {
                ...display[project.id]?.[action.locale],
                ...localized,
            },
        };
        // Email previews share protected contact storage with the edit profile.
        if (editable.length) {
            records[project.id].edit = {
                ...records[project.id].edit,
                ...stableEdit,
            };
        }
        if (action.profile === 'edit') {
            edit[project.id] = {
                ...edit[project.id],
                [action.locale]: {
                    ...edit[project.id]?.[action.locale],
                    ...localizedEdit,
                },
            };
        }
    }
    return {
        ...state,
        records,
        translations: { display, edit, stored },
        lists: action.single
            ? state.lists
            : {
                  ...state.lists,
                  [action.key]: {
                      ids: action.data.data.map(({ id }) => id),
                      pagination: action.data.pagination,
                  },
              },
        requests: {
            ...state.requests,
            [action.key]: {
                status: 'succeeded',
                error: null,
                ...(action.single
                    ? {
                          id: action.data.data.id,
                          profile: action.profile,
                          include: action.include,
                      }
                    : {}),
            },
        },
    };
}
