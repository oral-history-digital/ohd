import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId } from 'modules/archive';
import { fetchData, getCurrentProject } from 'modules/data';
import { fetchRegistryTree } from '../actions';
import { getDataAvailable, getTree } from '../selectors';
import TreeSelectWrapper from './TreeSelectWrapper';

const mapStateToProps = (state, ownProps) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    dataAvailable: getDataAvailable(state),
    tree: getTree(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    fetchRegistryTree,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TreeSelectWrapper);
