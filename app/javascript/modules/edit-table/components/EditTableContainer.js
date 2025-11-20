import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getArchiveId } from 'modules/archive';
import {
    fetchData,
    getCurrentInterview,
    getCurrentProject,
    getSegmentsStatus,
} from 'modules/data';
import { getCurrentTape, getMediaTime } from 'modules/media-player';
import { getFilter } from '../selectors';
import EditTable from './EditTable';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
    filter: getFilter(state),
    segmentsStatus: getSegmentsStatus(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EditTable);
