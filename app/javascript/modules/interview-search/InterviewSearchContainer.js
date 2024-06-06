import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentRefTreeStatus } from 'modules/data';
import { getArchiveId } from 'modules/archive';
import InterviewSearch from './InterviewSearch';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    refTreeStatus: getCurrentRefTreeStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearch);
