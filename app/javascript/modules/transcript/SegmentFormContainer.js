import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId } from 'modules/archive';
import { submitData, getProjects } from 'modules/data';
import SegmentForm from './SegmentForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SegmentForm);
