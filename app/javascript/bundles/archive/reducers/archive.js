import {
    SET_LOCALE,
    SET_ARCHIVE_ID,

    REQUEST_STATIC_CONTENT,
    RECEIVE_STATIC_CONTENT,

    CHANGE_TO_EDIT_VIEW,

    //EXPORT_DOI,
    RECEIVE_RESULT
} from '../constants/archiveConstants';

const initialState = {
    locale: 'de',
    locales: ['de', 'el'],
    archiveId: null,

    homeContent: "",
    externalLinks: {},

    editView: true,
    doiResult: {}
}

const archive = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOCALE:
            return Object.assign({}, state, {
                locale: action.locale
            })
        case SET_ARCHIVE_ID:
            return Object.assign({}, state, {
                archiveId: action.archiveId
            })
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
                registryEntrySearchFacetIds: action.registryEntrySearchFacetIds,
                personPropertiesRegistryReferenceType: action.personPropertiesRegistryReferenceType,
                languages: action.languages,
                uploadTypes: action.uploadTypes,
                locales: action.locales,
                project: action.project,
                projectDoi: action.projectDoi,
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
