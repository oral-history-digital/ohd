import { connect } from 'react-redux';

import { getLocale, getCountryKeys, getTranslations } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import UsersAdminTabPanel from './UsersAdminTabPanel';

const mapStateToProps = (state) => ({
    project: getCurrentProject(state),
    countryKeys: getCountryKeys(state),
    locale: getLocale(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(UsersAdminTabPanel);
