import { connect } from 'react-redux';

import ArchiveSearchTabPanel from './ArchiveSearchTabPanel';

const mapStateToProps = (state) => ({
    selectedArchiveIds: state.archive.selectedArchiveIds,
});

export default connect(mapStateToProps)(ArchiveSearchTabPanel);
