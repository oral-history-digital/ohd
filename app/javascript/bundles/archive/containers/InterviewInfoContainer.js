import { connect } from 'react-redux';
import InterviewInfo from '../components/InterviewInfo';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';

import { getInterview, getProject, getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        project: project,
        collections: state.data.collections,
        interview: getInterview(state),
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        collections: state.data.collections,
        // the following is just a trick to force rerender after deletion
        contributionsLastModified: state.data.statuses.contributions.lastModified,
        contributionTypes: state.archive.contributionTypes,
        languages: state.data.languages,
        editView: state.archive.editView,
        account: state.data.accounts.current,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewInfo);

