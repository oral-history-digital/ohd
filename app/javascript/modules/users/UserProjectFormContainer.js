import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import UserProjectForm from './UserProjectForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserProjectForm);
