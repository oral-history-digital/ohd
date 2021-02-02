import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getLocale, getTranslations } from 'modules/archive';
import { getCurrentAccount } from 'modules/data';
import WrappedAccount from './WrappedAccount';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAccount);
