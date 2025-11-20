import { connect } from 'react-redux';

import { getNormDataProviders } from 'modules/data';
import NormDatumForm from './NormDatumForm';

const mapStateToProps = (state) => {
    return {
        normDataProviders: getNormDataProviders(state),
    };
};

export default connect(mapStateToProps)(NormDatumForm);
