import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getProjects } from 'modules/data';
import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import AnnotationForm from './AnnotationForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    projects: getProjects(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationForm);
