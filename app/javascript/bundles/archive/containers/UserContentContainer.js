import { connect } from 'react-redux';

import UserContent from '../components/UserContent';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { handleSegmentClick } from '../actions/interviewActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: time => dispatch(handleSegmentClick(time)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
