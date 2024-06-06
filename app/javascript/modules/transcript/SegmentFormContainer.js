import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId } from 'modules/archive';
import { submitData, getCurrentProject } from 'modules/data';
import SegmentForm from './SegmentForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SegmentForm);
