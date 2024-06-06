import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import SegmentHeadingForm from './SegmentHeadingForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SegmentHeadingForm);
