import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getFlyoutTabsVisible, setFlyoutTabsIndex } from 'modules/flyout-tabs';
import SearchMap from './SearchMap';

const mapStateToProps = state => ({
    flyoutTabsVisible: getFlyoutTabsVisible(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SearchMap);
