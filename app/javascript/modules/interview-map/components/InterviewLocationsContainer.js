import { connect } from 'react-redux';

import { getArchiveId } from 'modules/archive';
import InterviewLocations from './InterviewLocations';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
});

export default connect(mapStateToProps)(InterviewLocations);
