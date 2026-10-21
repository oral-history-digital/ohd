import { getArchiveId } from 'modules/archive';
import {
    fetchData,
    getCurrentInterview,
    getSegmentsStatus,
} from 'modules/data';
import { getCurrentTape, getMediaTime } from 'modules/media-player';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getFilter } from '../selectors';
import EditTable from './EditTable';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
    filter: getFilter(state),
    segmentsStatus: getSegmentsStatus(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EditTable);
