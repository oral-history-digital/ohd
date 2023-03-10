import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import BiographicalEntry from './BiographicalEntry';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BiographicalEntry);
