import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Home from '../components/Home';
import { getProject } from '../../../lib/utils';
import { fetchData } from '../actions/dataActionCreators';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.account.isLoggedIn,
        randomFeaturedInterviews: state.data.random_featured_interviews,
        randomFeaturedInterviewsStatus: state.data.statuses.random_featured_interviews,
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        project: getProject(state),
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Home));
