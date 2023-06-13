import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleSidebar, getSidebarVisible } from 'modules/sidebar';
import { setLocale } from 'modules/archive';
import { fetchData, getCollectionsStatus, getLanguagesStatus,
    getProjectsStatus } from 'modules/data';
import { getLoggedInAt } from 'modules/user';
import Layout from './Layout';

const mapStateToProps = state => ({
    projectsStatus: getProjectsStatus(state),
    sidebarVisible: getSidebarVisible(state),
    loggedInAt: getLoggedInAt(state),
    collectionsStatus: getCollectionsStatus(state),
    languagesStatus: getLanguagesStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    toggleSidebar,
    setLocale,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
