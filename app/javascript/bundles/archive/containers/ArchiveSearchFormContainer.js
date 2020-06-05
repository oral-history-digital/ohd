import { connect } from 'react-redux';

import ArchiveSearchForm from '../components/ArchiveSearchForm';
import { 
    resetQuery, 
    setQueryParams, 
    searchInArchive,
    searchInMap,
} from '../actions/searchActionCreators';
import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return {
        allInterviewsTitles: state.search.archive.allInterviewsTitles,
        allInterviewsPseudonyms: state.search.archive.allInterviewsPseudonyms,
        facets: state.search.archive.facets,
        mapSearchFacets: state.search.map.facets,
        query: state.search.archive.query,
        translations: state.archive.translations,
        locale: state.archive.locale,
        isArchiveSearching: state.search.isArchiveSearching,
        isMapSearching: state.search.isMapSearching,
        projectId: state.archive.projectId
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    searchInMap: (url, query) => dispatch(searchInMap(url, query)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchForm);
