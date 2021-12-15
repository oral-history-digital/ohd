import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData, getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import Data from './Data';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Data);
