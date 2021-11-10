import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Home from './Home';
import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getCurrentProject, getProjectTranslation, getShowFeaturedInterviews, getShowStartPageVideo } from 'modules/data';

const mapStateToProps = state => ({
    project: getCurrentProject(state),
    projectTranslation: getProjectTranslation(state),
    showStartPageVideo: getShowStartPageVideo(state),
    showFeaturedInterviews: getShowFeaturedInterviews(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
