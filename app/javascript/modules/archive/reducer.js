import {
    SET_LOCALE,
    SET_ARCHIVE_ID,
    SET_PROJECT_ID,
    SET_VIEW_MODE,
    REQUEST_STATIC_CONTENT,
    RECEIVE_STATIC_CONTENT,
    CHANGE_TO_EDIT_VIEW,
    CHANGE_TO_INTERVIEW_EDIT_VIEW,
    RECEIVE_RESULT,
    UPDATE_SELECTED_ARCHIVE_IDS,
    SET_SELECTED_ARCHIVE_IDS,
    UPDATE_SELECTED_REGISTRY_ENTRY_IDS
} from './action-types';

const initialState = {
    locale: 'de',
    archiveId: null,
    projectId: null,
    viewModes: ['grid', 'list'],
    viewMode: 'grid',

    listColumns: [],
    detailViewFields: [],

    homeContent: "",
    externalLinks: {},

    editView: false,
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
        case SET_VIEW_MODE:
            return Object.assign({}, state, {
                viewMode: action.viewMode
            })
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
        case REQUEST_STATIC_CONTENT:
            return Object.assign({}, state, {
                isFetchingExternalLinks: true
            })
        case RECEIVE_STATIC_CONTENT:
            return Object.assign({}, state, {
                homeContent: action.homeContent,
                translations: action.translations,
                country_keys: action.countryKeys,
                registryEntryMetadataFields: action.registryEntryMetadataFields,
                registryReferenceTypeMetadataFields: action.registryReferenceTypeMetadataFields,
            })
        case CHANGE_TO_EDIT_VIEW:
            return Object.assign({}, state, {
                editView: action.editView
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
