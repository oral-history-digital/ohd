import { connect } from 'react-redux';

import { getSelectedArchiveIds } from 'modules/archive';
import ArchiveSearchTabPanel from './ArchiveSearchTabPanel';

const mapStateToProps = (state) => ({
    selectedArchiveIds: getSelectedArchiveIds(state),
});

export default connect(mapStateToProps)(ArchiveSearchTabPanel);
