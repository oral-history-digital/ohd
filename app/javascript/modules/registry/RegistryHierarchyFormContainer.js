import { connect } from 'react-redux';

import { submitData, getProjects } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getLocale, getProjectId } from 'modules/archive';
import RegistryHierarchyForm from './RegistryHierarchyForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: state.archive.translations,
        languages: state.data.languages,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryHierarchyForm);
