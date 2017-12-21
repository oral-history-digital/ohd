import { connect } from 'react-redux';

import FoundSegment from '../components/FoundSegment';
import { handleSegmentClick } from '../actions/interviewActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FoundSegment);
