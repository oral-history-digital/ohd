import { connect } from 'react-redux';

import { getEditView, getLocale, getTranslations } from 'modules/archive';
import { getCurrentAccount } from 'modules/data';
import UserRegistration from './UserRegistration';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
});

export default connect(mapStateToProps)(UserRegistration);
