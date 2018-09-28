import { connect } from 'react-redux';

import UserContents from '../components/UserContents';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        contents: state.data.user_contents,
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContents);
