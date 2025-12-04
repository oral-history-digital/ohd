import { submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MetadataFieldForm from './MetadataFieldForm';

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(MetadataFieldForm);
