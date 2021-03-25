import { connect } from 'react-redux';

import { getLocale, getCountryKeys, getTranslations, getProjectId, getEditView } from 'modules/archive';
import UsersAdminTabPanel from './UsersAdminTabPanel';

const mapStateToProps = (state) => ({
    countryKeys: getCountryKeys(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    projectId: getProjectId(state),
    projects: state.data.projects,
    account: state.data.accounts.current,
    editView: getEditView(state),
});

export default connect(mapStateToProps)(UsersAdminTabPanel);
