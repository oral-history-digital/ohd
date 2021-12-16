import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getProjects, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import RequestProjectAccessForm from './RequestProjectAccessForm';

const mapStateToProps = state => {
    const project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        externalLinks: project && project.external_links,
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RequestProjectAccessForm);
