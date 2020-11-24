import { connect } from 'react-redux';

import ArchiveSearchTabPanel from '../../components/flyout-tabs/ArchiveSearchTabPanel';

const mapStateToProps = (state) => ({
    selectedArchiveIds: state.archive.selectedArchiveIds,
});

export default connect(mapStateToProps)(ArchiveSearchTabPanel);
