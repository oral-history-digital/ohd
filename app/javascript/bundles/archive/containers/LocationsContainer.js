import { connect } from 'react-redux';

import Locations from '../components/Locations';
import { getFlyoutTabsVisible } from '../selectors/flyoutTabsSelectors';

const mapStateToProps = (state) => ({
    visible: getFlyoutTabsVisible(state),
});

export default connect(mapStateToProps)(Locations);
