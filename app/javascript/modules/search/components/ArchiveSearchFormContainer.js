import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId } from 'modules/archive';
import { hideSidebar } from 'modules/sidebar';
import { resetQuery, setQueryParams, searchInArchive, setMapQuery, clearSearch,
    clearAllInterviewSearch } from '../actions';
import { getArchiveFacets, getArchiveQuery, getMapFacets } from '../selectors';
import ArchiveSearchForm from './ArchiveSearchForm';

const mapStateToProps = state => ({
    allInterviewsTitles: state.search.archive.allInterviewsTitles,
    allInterviewsPseudonyms: state.search.archive.allInterviewsPseudonyms,
    facets: getArchiveFacets(state),
    mapSearchFacets: getMapFacets(state),
    query: getArchiveQuery(state),
    locale: getLocale(state),
    isArchiveSearching: state.search.isArchiveSearching,
    isMapSearching: state.search.isMapSearching,
    projectId: getProjectId(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setQueryParams,
    resetQuery,
    clearSearch,
    clearAllInterviewSearch,
    searchInArchive,
    setMapQuery,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchForm);
