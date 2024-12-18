import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import AnnotationForm from './AnnotationForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationForm);
