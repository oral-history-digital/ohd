import { AUTH_ERROR, LOGGED_IN, LOGOUT } from 'modules/user/action-types';

import {
    INITIALIZE_PROJECTS,
    RECEIVE_DATA,
    RECEIVE_ERROR,
    REMOVE_DATA,
    REPLACE_INSTANCE_SETTINGS,
    REQUEST_DATA,
    UPDATE_DATA,
} from './action-types';
import { localizedProjectFields, projectEditFields } from './projectRecords';
import { v2RequestKey } from './v2Requests';

const accessResources = [
    'roles',
    'permissions',
    'user_roles',
    'user_projects',
    'role_permissions',
    'access_configs',
    'instance_settings',
];
const affiliateResources = [
    'affiliates',
    'cooperation_partners',
    'leaders',
    'managers',
    'funders',
];
const projectAccessFields = [
    'workflow_state',
    'grant_access_without_login',
    'grant_project_access_instantly',
    'show_preview_img',
    'shortname',
    'archive_domain',
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
 * Marks affected queries for refresh while keeping loaded pages and form state mounted.
 * Moves all query keys to the next generation so pre-save responses are discarded.
 * Pending reads restart because their old responses can no longer be accepted.
 *
 * @param {V2ProjectState} state - Current records and query results.
 * @param {Object} action - Resource mutation with an optional owning project ID.
 * @param {string} resource - Changed resource, including legacy nested resources.
 * @returns {V2ProjectState} Retained data with refreshed query keys and stale request statuses.
 */
function invalidateProjectQueries(state, action, resource) {
    const generation = state.generation + 1;
    const projectId =
        action.dataType === 'projects' ? action.id : action.data?.project_id;
    const requests = {};
    const lists = {};
    for (const [oldKey, request] of Object.entries(state.requests)) {
        if (!request.url) continue;
        const owner = request.projectId || request.id;
        const sameProject =
            !projectId || !owner || String(owner) === String(projectId);
        const affected =
            sameProject &&
            (request.projectResource
                ? request.projectResource === resource
                : !affiliateResources.includes(resource) ||
                  request.include?.includes('affiliates'));
        const key = v2RequestKey(request.url, state.context, generation);
        requests[key] =
            affected || request.status === 'pending'
                ? { ...request, status: 'stale', error: null }
                : request;
        if (state.lists[oldKey]) lists[key] = state.lists[oldKey];
    }
    return { ...state, generation, requests, lists };
}

/**
 * Stores project lists and details without changing legacy project records.
 * Merges shared fields while preserving omitted fields and other locales. Editing
 * additions and preview contact data stay separate from ordinary display reads.
 * Access changes clear cached content. Ordinary mutations retain loaded data and
 * refresh affected queries; both discard older in-flight responses.
 * Queued-job acknowledgements retain cached project data.
 * Bootstrap summaries initialize records without completing any list/detail query.
 *
 * @param {V2ProjectState|undefined} state - Existing v2 project state, if initialized.
 * @param {Object} action - Bootstrap, request, or legacy access/mutation action.
 * @returns {V2ProjectState|undefined} Updated state, or the original value for ignored actions.
 */
export function reduceV2Projects(state, action) {
    // Legacy saves trigger fresh reads; their response shapes never become project records here.
    if (action.apiVersion !== 2) {
        if (!state) return state;
        const accountChanged =
            action.dataType === 'users' &&
            String(action.id) === 'current' &&
            [RECEIVE_DATA, REMOVE_DATA].includes(action.type);
        const resource =
            action.mutationResource || action.nestedDataType || action.dataType;
        const recordsChanged =
            relatedResources.includes(resource) &&
            ([REMOVE_DATA, UPDATE_DATA].includes(action.type) ||
                // "processing" acknowledges queued work; keep project views mounted.
                (action.mutation &&
                    action.type === RECEIVE_DATA &&
                    action.msg !== 'processing'));
        if (
            accountChanged ||
            action.type === REPLACE_INSTANCE_SETTINGS ||
            [LOGGED_IN, LOGOUT, AUTH_ERROR].includes(action.type)
        )
            return emptyProjects(state.generation + 1);
        if (recordsChanged) {
            const previous = state.records[action.id];
            const accessChanged =
                resource === 'projects' &&
                (action.type === REMOVE_DATA ||
                    action.mutationDeleted ||
                    (previous &&
                        projectAccessFields.some(
                            (field) =>
                                Object.hasOwn(action.data || {}, field) &&
                                (previous[field] || null) !==
                                    (action.data[field] || null)
                        )));
            if (accessResources.includes(resource) || accessChanged)
                return emptyProjects(state.generation + 1);
            return invalidateProjectQueries(state, action, resource);
        }
        return state;
    }
    if (action.dataType !== 'projects') return state;
    state ||= emptyProjects();
    if (action.generation !== state.generation) return state;
    const initializing = action.type === INITIALIZE_PROJECTS;
    if (initializing) state = emptyProjects(state.generation, action.context);
    if (action.type === REQUEST_DATA) {
        if (state.context !== action.context)
            state = emptyProjects(state.generation, action.context);
        return {
            ...state,
            requests: {
                ...state.requests,
                [action.key]: {
                    ...state.requests[action.key],
                    url: action.url,
                    include: action.include,
                    projectResource: action.projectResource,
                    projectId: action.projectId,
                    status: 'pending',
                    error: null,
                },
            },
        };
    }
    // An access change or mutation may have invalidated this response in flight.
    if (
        !initializing &&
        (state.context !== action.context ||
            state.requests[action.key]?.status !== 'pending')
    )
        return state;
    if (action.type === RECEIVE_ERROR)
        return {
            ...state,
            requests: {
                ...state.requests,
                [action.key]: {
                    ...state.requests[action.key],
                    status: 'failed',
                    error: action.error,
                    id: undefined,
                    ready: false,
                },
            },
        };
    if (action.type !== RECEIVE_DATA && !initializing) return state;

    // Resource records still use their existing nested storage, not project summaries.
    if (action.projectResource)
        return {
            ...state,
            requests: {
                ...state.requests,
                [action.key]: {
                    ...state.requests[action.key],
                    status: 'succeeded',
                    error: null,
                    ready: true,
                },
            },
        };

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
        lists:
            action.single || initializing
                ? state.lists
                : {
                      ...state.lists,
                      [action.key]: {
                          ids: action.data.data.map(({ id }) => id),
                          pagination: action.data.pagination,
                      },
                  },
        // Bootstrap contains summaries, not evidence that a list/detail query is complete.
        requests: initializing
            ? state.requests
            : {
                  ...state.requests,
                  [action.key]: {
                      ...state.requests[action.key],
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
