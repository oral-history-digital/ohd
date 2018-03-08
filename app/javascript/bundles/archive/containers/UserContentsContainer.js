import { connect } from 'react-redux';

import UserContents from '../components/UserContents';
import { fetchUserContents } from '../actions/userContentActionCreators';

const mapStateToProps = (state) => {
    return { 
        contents: state.userContent.contents,
        fetched: state.userContent.fetched,
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchUserContents: () => dispatch(fetchUserContents())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContents);
