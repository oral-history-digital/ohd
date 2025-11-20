import { setArchiveId } from 'modules/archive';
import {
    fetchData,
    getInterviews,
    getProjects,
    getStatuses,
} from 'modules/data';
import { sendTimeChangeRequest } from 'modules/media-player';
import { hideSidebar } from 'modules/sidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import WorkbookItem from './WorkbookItem';

const mapStateToProps = (state) => ({
    projects: getProjects(state),
    statuses: getStatuses(state),
    interviews: getInterviews(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            sendTimeChangeRequest,
            setArchiveId,
            hideSidebar,
            fetchData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(WorkbookItem);
