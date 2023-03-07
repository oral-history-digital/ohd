import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getProjects } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import UserForm from './UserForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
