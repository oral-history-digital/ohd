import { connect } from 'react-redux';

import { getLocale, getCountryKeys, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { getProjects, getCurrentAccount } from 'modules/data';
import ProjectConfigTabPanel from './ProjectConfigTabPanel';

const mapStateToProps = (state) => ({
    countryKeys: getCountryKeys(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
});

export default connect(mapStateToProps)(ProjectConfigTabPanel);