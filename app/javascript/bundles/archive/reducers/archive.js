import {
    SET_LOCALE,
    SET_ARCHIVE_ID,
    SET_VIEW_MODE,

    REQUEST_STATIC_CONTENT,
    RECEIVE_STATIC_CONTENT,

    CHANGE_TO_EDIT_VIEW,

    //EXPORT_DOI,
    RECEIVE_RESULT,
    UPDATE_SELECTED_ARCHIVE_IDS
} from '../constants/archiveConstants';

const initialState = {
    locale: 'de',
    locales: ['de', 'el'],
    archiveId: null,
    viewMode: 'grid',

    homeContent: "",
    externalLinks: {},

    editView: false,
    doiResult: {},
    selectedArchiveIds: []
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
        case SET_VIEW_MODE:
            return Object.assign({}, state, {
                viewMode: action.viewMode
            })
        case UPDATE_SELECTED_ARCHIVE_IDS:
            if(state.selectedArchiveIds.indexOf(action.archiveId) === -1) {
                return Object.assign({}, state, { selectedArchiveIds: [...state.selectedArchiveIds, action.archiveId] })
            } else {
                return Object.assign({}, state, { selectedArchiveIds: state.selectedArchiveIds.filter(archiveId => archiveId !== action.archiveId) })
            }
        case REQUEST_STATIC_CONTENT:
            return Object.assign({}, state, {
                isFetchingExternalLinks: true
            })
        case RECEIVE_STATIC_CONTENT:
            return Object.assign({}, state, {
                isFetchingExternalLinks: false,
                externalLinks: action.externalLinks,
                homeContent: action.homeContent,
                translations: action.translations,
                country_keys: action.countryKeys,
                collections: action.collections,
                contributionTypes: action.contributionTypes,
                rootRegistryEntry: action.rootRegistryEntry,
                registryEntrySearchFacets: action.registryEntrySearchFacets,
                personPropertiesRegistryReferenceType: action.personPropertiesRegistryReferenceType,
                languages: action.languages,
                uploadTypes: action.uploadTypes,
                locales: action.locales,
                project: action.project,
                projectDoi: action.projectDoi,
                hiddenRegistryEntryIds: action.hiddenRegistryEntryIds,
                projectName: action.projectName,
                archiveDomain: action.archiveDomain,
                projectDomain: action.projectDomain
            })
        case CHANGE_TO_EDIT_VIEW:
            return Object.assign({}, state, {
                editView: action.editView
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
