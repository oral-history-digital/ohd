import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import Messages from './Messages';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
});

export default connect(mapStateToProps)(Messages);
