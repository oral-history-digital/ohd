import {
    SET_LOCALE,
    SET_ARCHIVE_ID,
    SET_PROJECT_ID,
    SET_AVAILABLE_VIEW_MODES,
    SET_VIEW_MODE,
    CLEAR_VIEW_MODES,
    CHANGE_TO_EDIT_VIEW,
    CHANGE_TO_TRANSLATIONS_VIEW,
    CHANGE_TO_INTERVIEW_EDIT_VIEW,
    RECEIVE_RESULT,
    UPDATE_SELECTED_ARCHIVE_IDS,
    SET_SELECTED_ARCHIVE_IDS,
    UPDATE_SELECTED_REGISTRY_ENTRY_IDS
} from './action-types';

export const initialState = {
    locale: 'de',
    archiveId: null,
    projectId: null,
    viewModes: null,
    viewMode: null,
    listColumns: [],
    detailViewFields: [],
    homeContent: "",
    externalLinks: {},
    editView: false,
    translationsView: false,
    doiResult: {},
    selectedArchiveIds: ['dummy']
}

const archive = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOCALE:
            if (state.projectName) document.title = state.projectName[action.locale]
            return Object.assign({}, state, {
                locale: action.locale
            })
        case SET_ARCHIVE_ID:
            return Object.assign({}, state, {
                archiveId: action.archiveId
            })
        case SET_PROJECT_ID:
            return Object.assign({}, state, {
                projectId: action.projectId
            })
        case SET_AVAILABLE_VIEW_MODES:
            return {
                ...state,
                viewModes: action.payload,
            };
        case SET_VIEW_MODE:
            return {
                ...state,
                viewMode: action.payload,
            };
        case CLEAR_VIEW_MODES:
            return {
                ...state,
                viewModes: null,
                viewMode: null,
            };
        case SET_SELECTED_ARCHIVE_IDS:
            return Object.assign({}, state, { selectedArchiveIds: ['dummy'].concat(action.archiveIds) })
        case UPDATE_SELECTED_ARCHIVE_IDS:
            if(action.archiveId === -1) {
                return Object.assign({}, state, { selectedArchiveIds: ['dummy'] })
            } else if(state.selectedArchiveIds.indexOf(action.archiveId) === -1) {
                return Object.assign({}, state, { selectedArchiveIds: [...state.selectedArchiveIds, action.archiveId] })
            } else {
                return Object.assign({}, state, { selectedArchiveIds: state.selectedArchiveIds.filter(archiveId => archiveId !== action.archiveId) })
            }
        case UPDATE_SELECTED_REGISTRY_ENTRY_IDS:
            if(action.rid === -1) {
                return Object.assign({}, state, { selectedRegistryEntryIds: ['dummy'] })
            } else if(state.selectedRegistryEntryIds.indexOf(action.rid) === -1) {
                return Object.assign({}, state, { selectedRegistryEntryIds: [...state.selectedRegistryEntryIds, action.rid] })
            } else {
                return Object.assign({}, state, { selectedRegistryEntryIds: state.selectedRegistryEntryIds.filter(rid => rid !== action.rid) })
            }
        case CHANGE_TO_EDIT_VIEW:
            return Object.assign({}, state, {
                editView: action.editView
            })
        case CHANGE_TO_TRANSLATIONS_VIEW:
            return Object.assign({}, state, {
                translationsView: action.translationsView
            })
        case CHANGE_TO_INTERVIEW_EDIT_VIEW:
            return Object.assign({}, state, {
                interviewEditView: action.interviewEditView
            })
        case RECEIVE_RESULT:
            return Object.assign({}, state, {
                doiResult: action.result
            })

        default:
            return state;
    }
};

export default archive;
