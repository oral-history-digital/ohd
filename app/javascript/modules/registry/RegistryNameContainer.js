import { connect } from 'react-redux';

import { submitData, deleteData, getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import RegistryName from './RegistryName';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryName);
