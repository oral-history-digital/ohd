import { getSelectedArchiveIds } from 'modules/archive';
import { connect } from 'react-redux';

import MapTabPanel from './MapTabPanel';

const mapStateToProps = (state) => ({
    selectedArchiveIds: getSelectedArchiveIds(state),
});

export default connect(mapStateToProps)(MapTabPanel);
