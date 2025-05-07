import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleSidebar, getSidebarVisible } from 'modules/sidebar';
import { getBannerActive, hideBanner } from 'modules/banner';
import {
    fetchData, getCollectionsStatus, getLanguagesStatus,
    getProjectsStatus
} from 'modules/data';
import { getLoggedInAt } from 'modules/user';
import Layout from './Layout';

const mapStateToProps = state => ({
    bannerActive: getBannerActive(state),
    collectionsStatus: getCollectionsStatus(state),
    languagesStatus: getLanguagesStatus(state),
    loggedInAt: getLoggedInAt(state),
    projectsStatus: getProjectsStatus(state),
    sidebarVisible: getSidebarVisible(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    toggleSidebar,
    hideBanner,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
