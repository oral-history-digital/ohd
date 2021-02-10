import { connect } from 'react-redux';

import { getProject } from 'lib/utils';
import { submitData, fetchData, getCurrentInterview } from 'modules/data';
import PersonData from './PersonData';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        interview: getCurrentInterview(state),
        people: state.data.people,
        isLoggedIn: state.account.isLoggedIn,
        project: project,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PersonData);
