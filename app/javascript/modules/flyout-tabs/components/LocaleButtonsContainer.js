import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { setLocale, getLocale, getProjectId } from 'modules/archive';
import { getProjects, getProjectLocales } from 'modules/data';
import LocaleButtons from './LocaleButtons';

const mapStateToProps = state => ({
    currentLocale: getLocale(state),
    locales: getProjectLocales(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setLocale,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LocaleButtons));
