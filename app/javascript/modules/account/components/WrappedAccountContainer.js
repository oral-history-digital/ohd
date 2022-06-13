import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getCurrentAccount, getProjects } from 'modules/data';
import WrappedAccount from './WrappedAccount';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    projects: getProjects(state),
});

export default connect(mapStateToProps)(WrappedAccount);
