import { connect } from 'react-redux';

import { getCurrentInterview, getCurrentProject } from 'modules/data';
import { getEditView, getLocale, getTranslations } from 'modules/archive';
import { getIsLoggedIn } from 'modules/account';
import SelectedRegistryReferences from './SelectedRegistryReferences';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    editView: getEditView(state),
    interview: getCurrentInterview(state),
    project: getCurrentProject(state),
    isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(SelectedRegistryReferences);