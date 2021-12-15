import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getProjects } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getLocale, getProjectId } from 'modules/archive';
import RegistryHierarchyForm from './RegistryHierarchyForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryHierarchyForm);
