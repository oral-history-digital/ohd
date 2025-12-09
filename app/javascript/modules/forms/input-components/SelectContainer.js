import { getLocale } from 'modules/archive';
import { connect } from 'react-redux';

import Select from './Select';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
    };
};

export default connect(mapStateToProps)(Select);
