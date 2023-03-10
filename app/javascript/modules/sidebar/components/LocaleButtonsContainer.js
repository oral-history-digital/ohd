import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setLocale, getLocale, getProjectId } from 'modules/archive';
import { getProjectLocales, getCurrentProject } from 'modules/data';
import LocaleButtons from './LocaleButtons';

const mapStateToProps = state => ({
    currentLocale: getLocale(state),
    locales: getProjectLocales(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setLocale,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LocaleButtons);
