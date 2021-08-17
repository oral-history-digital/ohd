import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import YearRange from './YearRange';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
    }
}

export default connect(mapStateToProps)(YearRange);
