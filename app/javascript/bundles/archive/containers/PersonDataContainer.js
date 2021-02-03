import { connect } from 'react-redux';
import PersonData from '../components/PersonData';
import { getInterview, getCookie, getProject } from 'lib/utils';
import { submitData, fetchData } from 'modules/data';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        interview: interview,
        people: state.data.people,
        contributionTypes: state.archive.contributionTypes,
        isLoggedIn: state.account.isLoggedIn,
        project: project,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PersonData);
