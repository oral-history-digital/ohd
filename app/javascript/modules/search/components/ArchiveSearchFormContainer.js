import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { getLocale, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { hideSidebar } from 'modules/sidebar';
import { getProjects, getCurrentAccount, getCurrentProject } from 'modules/data';
import { resetQuery, setQueryParams, searchInArchive, setMapQuery, clearSearch,
    clearAllInterviewSearch } from '../actions';
import { getArchiveFacets, getArchiveQuery, getMapFacets } from '../selectors';
import ArchiveSearchForm from './ArchiveSearchForm';

const mapStateToProps = (state) => {
    return {
        allInterviewsTitles: state.search.archive.allInterviewsTitles,
        allInterviewsPseudonyms: state.search.archive.allInterviewsPseudonyms,
        facets: getArchiveFacets(state),
        mapSearchFacets: getMapFacets(state),
        query: getArchiveQuery(state),
        translations: getTranslations(state),
        locale: getLocale(state),
        isArchiveSearching: state.search.isArchiveSearching,
        isMapSearching: state.search.isMapSearching,
        projectId: getProjectId(state),
        projects: getProjects(state),
        project: getCurrentProject(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setQueryParams,
    resetQuery,
    clearSearch,
    clearAllInterviewSearch,
    searchInArchive,
    setMapQuery,
    hideSidebar,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ArchiveSearchForm));
