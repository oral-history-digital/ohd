import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hideSidebar } from 'modules/sidebar';
import { setViewMode, getViewModes, getViewMode } from 'modules/archive';
import ArchiveSearchTabs from './ArchiveSearchTabs';

const mapStateToProps = (state) => ({
    viewModes: getViewModes(state),
    currentViewMode: getViewMode(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            setViewMode,
            hideSidebar,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchTabs);
