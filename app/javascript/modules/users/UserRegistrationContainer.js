import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup } from 'modules/ui';
import { getEditView, getLocale, getTranslations } from 'modules/archive';
import { getCurrentAccount } from 'modules/data';
import UserRegistration from './UserRegistration';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    openArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistration);
