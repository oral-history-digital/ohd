import { connect } from 'react-redux';

import { getFlyoutTabsVisible } from 'modules/flyout-tabs';
import Locations from './Locations';

const mapStateToProps = (state) => ({
    visible: getFlyoutTabsVisible(state),
});

export default connect(mapStateToProps)(Locations);
