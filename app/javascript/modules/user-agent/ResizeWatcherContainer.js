import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ResizeWatcher from './ResizeWatcher';
import { hideFlyoutTabs, showFlyoutTabs } from 'modules/flyout-tabs';

const mapDispatchToProps = dispatch => bindActionCreators({
    hideFlyoutTabs,
    showFlyoutTabs,
}, dispatch);

export default connect(null, mapDispatchToProps)(ResizeWatcher);
