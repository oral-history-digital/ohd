import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData } from 'modules/data';
import BiographicalEntry from './BiographicalEntry';

const mapStateToProps = state => ({ });

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BiographicalEntry);
