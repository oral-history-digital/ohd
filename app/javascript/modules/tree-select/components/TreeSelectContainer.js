import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale } from 'modules/archive';
import { fetchRegistryTree } from '../actions';
import { getDataAvailable, getTree } from '../selectors';
import TreeSelectWrapper from './TreeSelectWrapper';

const mapStateToProps = (state, ownProps) => ({
    locale: getLocale(state),
    dataAvailable: getDataAvailable(state),
    tree: getTree(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchRegistryTree,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TreeSelectWrapper);
