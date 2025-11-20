import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ResizeWatcher from './ResizeWatcher';
import { hideSidebar, showSidebar } from 'modules/sidebar';

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            hideSidebar,
            showSidebar,
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(ResizeWatcher);
