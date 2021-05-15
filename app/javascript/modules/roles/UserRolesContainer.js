import { connect } from 'react-redux';

import { getEditView, getLocale, getTranslations } from 'modules/archive';
import { getCurrentAccount, getCurrentProject } from 'modules/data';
import UserRoles from './UserRoles';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(UserRoles);
