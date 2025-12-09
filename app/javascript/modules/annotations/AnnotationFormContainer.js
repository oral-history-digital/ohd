import { getLocale, getProjectId } from 'modules/archive';
import { getCurrentProject, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AnnotationForm from './AnnotationForm';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationForm);
