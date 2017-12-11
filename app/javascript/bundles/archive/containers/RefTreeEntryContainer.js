import { connect } from 'react-redux';

import RefTreeEntry from '../components/RefTreeEntry';
import { handleSegmentClick } from '../actions/interviewActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
  handleSegmentClick: time => dispatch(handleSegmentClick(time)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RefTreeEntry);
