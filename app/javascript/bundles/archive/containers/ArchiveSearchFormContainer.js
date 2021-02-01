import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ArchiveSearchForm from '../components/ArchiveSearchForm';
import {
    resetQuery,
    setQueryParams,
    searchInArchive,
    searchInMap,
} from '../actions/searchActionCreators';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { openArchivePopup } from 'modules/ui';

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
        projectId: state.archive.projectId,
        projects: state.data.projects,
        account: state.data.accounts.current,
        editView: state.archive.editView,
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

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ArchiveSearchForm));
