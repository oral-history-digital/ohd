import { getViewMode, getViewModes, setViewMode } from 'modules/archive';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ArchiveSearchTabs from './ArchiveSearchTabs';

const mapStateToProps = (state) => ({
    viewModes: getViewModes(state),
    currentViewMode: getViewMode(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            setViewMode,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchTabs);
