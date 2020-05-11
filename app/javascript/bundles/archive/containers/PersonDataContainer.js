import { connect } from 'react-redux';
import PersonData from '../components/PersonData';
import { getInterview, getCookie, getProject } from '../../../lib/utils';
import { submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        editView: state.archive.editView,
        interview: interview,
        people: state.data.people,
        contributionTypes: state.archive.contributionTypes,
        account: state.data.accounts.current,
        detailViewFields: (project && project.detail_view_fields) || [],
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps)(PersonData);
