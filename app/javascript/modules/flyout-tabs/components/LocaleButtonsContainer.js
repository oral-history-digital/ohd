import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { setLocale, getLocale, getLocales, getProjectId } from 'modules/archive';
import { getCurrentProject, getProjects } from 'modules/data';
import LocaleButtons from './LocaleButtons';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        currentLocale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    setLocale,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LocaleButtons));
