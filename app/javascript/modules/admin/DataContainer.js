import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData } from 'modules/data';
import Data from './Data';

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            deleteData,
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(Data);
