import { connect } from 'react-redux';

import Interview from '../components/Interview';
import { fetchData } from '../actions/dataActionCreators';
import { setArchiveId } from '../actions/archiveActionCreators';
import { getInterviewArchiveIdWithOffset } from '../../../lib/utils';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        projectId: state.archive.projectId,
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        isCatalog: project && project.is_catalog,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        interviews: state.data.interviews,
        interviewsStatus: state.data.statuses.interviews,
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        doiContentsStatus: state.data.statuses.doi_contents,
        prevArchiveId: getInterviewArchiveIdWithOffset(state.archive.archiveId, state.search.archive.foundInterviews, -1),
        nextArchiveId: getInterviewArchiveIdWithOffset(state.archive.archiveId, state.search.archive.foundInterviews, 1),
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
