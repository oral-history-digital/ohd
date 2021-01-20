import { connect } from 'react-redux';

import Locations from '../components/Locations';
import { getFlyoutTabsVisible } from 'modules/flyout-tabs';

const mapStateToProps = (state) => ({
    visible: getFlyoutTabsVisible(state),
});

export default connect(mapStateToProps)(Locations);
