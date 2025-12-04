import { getArchiveId } from 'modules/archive';
import { fetchData, getCurrentRefTreeStatus } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InterviewSearch from './InterviewSearch';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    refTreeStatus: getCurrentRefTreeStatus(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearch);
