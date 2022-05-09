import { connect } from 'react-redux';

import { getSelectedArchiveIds } from 'modules/archive';
import MapTabPanel from './MapTabPanel';

const mapStateToProps = (state) => ({
    selectedArchiveIds: getSelectedArchiveIds(state),
});

export default connect(mapStateToProps)(MapTabPanel);
