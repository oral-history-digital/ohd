import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleSidebar, getSidebarVisible } from 'modules/sidebar';
import { getLoggedInAt } from 'modules/user';
import Layout from './Layout';

const mapStateToProps = state => ({
    loggedInAt: getLoggedInAt(state),
    sidebarVisible: getSidebarVisible(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    toggleSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
