import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData } from 'modules/data';
import Annotation from './Annotation';

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            deleteData,
        },
        dispatch
    );

export default connect(undefined, mapDispatchToProps)(Annotation);
