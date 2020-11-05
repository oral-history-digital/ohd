import { connect } from 'react-redux';

import ResizeWatcher from '../components/ResizeWatcher';
import { hideFlyoutTabs, showFlyoutTabs, toggleFlyoutTabs } from '../actions/flyoutTabsActionCreators';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    showFlyoutTabs: () => dispatch(showFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResizeWatcher);
