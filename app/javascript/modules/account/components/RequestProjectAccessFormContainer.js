import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import RequestProjectAccessForm from './RequestProjectAccessForm';

const mapStateToProps = state => {
    const project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        translations: getTranslations(state),
        externalLinks: project && project.external_links,
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RequestProjectAccessForm);
