import { connect } from 'react-redux';

import { getSelectedArchiveIds } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import ArchiveSearchTabPanel from './ArchiveSearchTabPanel';

const mapStateToProps = (state) => ({
    selectedArchiveIds: getSelectedArchiveIds(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(ArchiveSearchTabPanel);
