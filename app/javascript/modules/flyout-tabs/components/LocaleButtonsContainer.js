import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { setLocale, getLocale, getLocales, getProjectId } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import LocaleButtons from './LocaleButtons';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        currentLocale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setLocale: locale => dispatch(setLocale(locale)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LocaleButtons));
