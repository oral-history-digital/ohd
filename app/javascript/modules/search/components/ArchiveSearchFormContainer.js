import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { getLocale, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { getProjects, getCurrentAccount } from 'modules/data';
import { resetQuery, setQueryParams, searchInArchive, searchInMap } from '../actions';
import ArchiveSearchForm from './ArchiveSearchForm';

const mapStateToProps = (state) => {
    return {
        allInterviewsTitles: state.search.archive.allInterviewsTitles,
        allInterviewsPseudonyms: state.search.archive.allInterviewsPseudonyms,
        facets: state.search.archive.facets,
        mapSearchFacets: state.search.map.facets,
        query: state.search.archive.query,
        translations: getTranslations(state),
        locale: getLocale(state),
        isArchiveSearching: state.search.isArchiveSearching,
        isMapSearching: state.search.isMapSearching,
        projectId: getProjectId(state),
        projects: getProjects(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setQueryParams,
    resetQuery,
    searchInArchive,
    searchInMap,
    hideFlyoutTabs,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ArchiveSearchForm));
