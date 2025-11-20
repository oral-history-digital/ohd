import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import Select from './Select';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
    };
};

export default connect(mapStateToProps)(Select);
