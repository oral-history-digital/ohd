import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import Data from './Data';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Data);
