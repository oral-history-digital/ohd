import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getProjectId } from 'modules/archive';
import { hideSidebar } from 'modules/sidebar';
import { clearAllInterviewSearch } from '../actions';
import { getArchiveQuery } from '../selectors';
import ArchiveSearchForm from './ArchiveSearchForm';

const mapStateToProps = state => ({
    query: getArchiveQuery(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    clearAllInterviewSearch,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchForm);
