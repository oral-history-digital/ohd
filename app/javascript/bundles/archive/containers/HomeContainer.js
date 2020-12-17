import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Home from '../components/Home';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';
import { getIsLoggedIn } from '../selectors/accountSelectors';
import { getLocale } from '../selectors/archiveSelectors';
import { getCurrentProject } from '../selectors/dataSelectors';
import { getShowFeaturedInterviews, getShowStartPageVideo } from '../selectors/projectSelectors';

const mapStateToProps = state => ({
    isLoggedIn: getIsLoggedIn(state),
    showStartPageVideo: getShowStartPageVideo(state),
    showFeaturedInterviews: getShowFeaturedInterviews(state),
    project: getCurrentProject(state),
    locale: getLocale(state),
});

const mapDispatchToProps = (dispatch) => ({
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Home));
