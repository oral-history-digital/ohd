import { getNormDataProviders } from 'modules/data';
import { connect } from 'react-redux';

import NormDatumForm from './NormDatumForm';

const mapStateToProps = (state) => {
    return {
        normDataProviders: getNormDataProviders(state),
    };
};

export default connect(mapStateToProps)(NormDatumForm);
