import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Home from '../components/Home';
import { fetchData } from '../actions/dataActionCreators';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';
import { getIsLoggedIn } from '../selectors/accountSelectors';
import { getLocale, getTranslations } from '../selectors/archiveSelectors';
import { getCurrentProject, getRandomFeaturedInterviews, getFeaturedInterviewsFetched } from '../selectors/dataSelectors';
import { getShowFeaturedInterviews, getShowStartPageVideo } from '../selectors/projectSelectors';

const mapStateToProps = state => ({
    isLoggedIn: getIsLoggedIn(state),
    showStartPageVideo: getShowStartPageVideo(state),
    showFeaturedInterviews: getShowFeaturedInterviews(state),
    randomFeaturedInterviews: getRandomFeaturedInterviews(state),
    featuredInterviewsFetched: getFeaturedInterviewsFetched(state),
    project: getCurrentProject(state),
    locale: getLocale(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Home));
