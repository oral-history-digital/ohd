import { connect } from 'react-redux';

import UserRoleForm from '../components/UserRoleForm';
import { submitData, fetchData } from '../actions/dataActionCreators';
import { closeArchivePopup } from 'modules/ui';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        languages: state.data.languages,
        roles: state.data.roles,
        rolesStatus: state.data.statuses.roles,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRoleForm);
