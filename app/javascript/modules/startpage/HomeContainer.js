import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Home from './Home';
import { setSidebarTabsIndex } from 'modules/sidebar';
import { getCurrentProject, getProjectTranslation, getShowFeaturedInterviews,
    getShowStartPageVideo, getInstitutions } from 'modules/data';

const mapStateToProps = state => ({
    project: getCurrentProject(state),
    projectTranslation: getProjectTranslation(state),
    showStartPageVideo: getShowStartPageVideo(state),
    showFeaturedInterviews: getShowFeaturedInterviews(state),
    institutions: getInstitutions(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSidebarTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
