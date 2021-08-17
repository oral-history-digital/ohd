import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getLocale, getTranslations } from 'modules/archive';
import { getCurrentAccount, getProjects } from 'modules/data';
import WrappedAccount from './WrappedAccount';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAccount);
