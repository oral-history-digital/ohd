import { connect } from 'react-redux';

import ResizeWatcher from '../components/ResizeWatcher';
import { hideFlyoutTabs, showFlyoutTabs } from 'modules/flyout-tabs';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    showFlyoutTabs: () => dispatch(showFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResizeWatcher);
