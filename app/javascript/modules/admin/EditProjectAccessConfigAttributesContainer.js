import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getProjectLocales, submitData, getCurrentProject, getCurrentUser } from 'modules/data';
import { getTranslations, getEditView } from 'modules/archive';
import EditData from './EditData';

const mapStateToProps = state => ({
    locales: getProjectLocales(state),
    translations: getTranslations(state),
    user: getCurrentUser(state),
    editView: getEditView(state),
    data: getCurrentProject(state),
    scope: 'project_access',
    helpTextCode: 'archive_access_config_form',
    formElements: [
    ],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditData);

