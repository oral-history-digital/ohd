import { connect } from 'react-redux';

import Home from '../components/Home';
import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getIsCampscapesProject, getProjectTranslation, getShowFeaturedInterviews,
    getShowStartPageVideo } from '../selectors/projectSelectors';

const mapStateToProps = state => ({
    isCampscapesProject: getIsCampscapesProject(state),
    projectTranslation: getProjectTranslation(state),
    showStartPageVideo: getShowStartPageVideo(state),
    showFeaturedInterviews: getShowFeaturedInterviews(state),
});

const mapDispatchToProps = (dispatch) => ({
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
