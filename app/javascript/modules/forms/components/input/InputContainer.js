import { getLocale } from 'modules/archive';
import { connect } from 'react-redux';

import Input from './Input';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
    };
};

export default connect(mapStateToProps)(Input);
