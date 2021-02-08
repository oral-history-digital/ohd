import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData, getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import Annotation from './Annotation';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projects: getProjects(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Annotation);
