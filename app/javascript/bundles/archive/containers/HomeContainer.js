import { connect } from 'react-redux';

import Home from '../components/Home';
import { getProject } from '../../../lib/utils';
import { fetchData } from '../actions/dataActionCreators';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.account.isLoggedIn,
        randomFeaturedInterviews: state.data.random_featured_interviews,
        randomFeaturedInterviewsStatus: state.data.statuses.random_featured_interviews,
        locale: state.archive.locale,
        project: getProject(state),
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(Home);
