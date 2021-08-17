import { connect } from 'react-redux';

import { getLocale, getCountryKeys, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { getProjects, getCurrentProject, getCurrentAccount } from 'modules/data';
import UsersAdminTabPanel from './UsersAdminTabPanel';

const mapStateToProps = (state) => ({
    countryKeys: getCountryKeys(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
});

export default connect(mapStateToProps)(UsersAdminTabPanel);
