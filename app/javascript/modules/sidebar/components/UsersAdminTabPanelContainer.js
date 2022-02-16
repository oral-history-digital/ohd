import { connect } from 'react-redux';

import { getLocale, getCountryKeys, getTranslations } from 'modules/archive';
import UsersAdminTabPanel from './UsersAdminTabPanel';

const mapStateToProps = (state) => ({
    countryKeys: getCountryKeys(state),
    locale: getLocale(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(UsersAdminTabPanel);
