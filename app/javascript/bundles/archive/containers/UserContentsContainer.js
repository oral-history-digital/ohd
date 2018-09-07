import { connect } from 'react-redux';

import UserContents from '../components/UserContents';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        contents: state.data.user_contents,
        status: state.data.statuses.user_contents.all,
        // the following is just a trick to force rerender after deletion
        lastModified: state.data.statuses.user_contents.lastModified,
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType) => dispatch(fetchData(dataType))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContents);
