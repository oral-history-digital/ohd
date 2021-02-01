import { connect } from 'react-redux';

import YearRange from './YearRange';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
    }
}

export default connect(mapStateToProps)(YearRange);
