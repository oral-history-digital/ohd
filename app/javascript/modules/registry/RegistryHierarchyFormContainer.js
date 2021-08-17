import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getProjects, getLanguages } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import RegistryHierarchyForm from './RegistryHierarchyForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        languages: getLanguages(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryHierarchyForm);
