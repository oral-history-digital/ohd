import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { setLocale } from 'modules/archive';
import { getProject } from 'lib/utils';
import LocaleButtons from './LocaleButtons';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        currentLocale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
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
