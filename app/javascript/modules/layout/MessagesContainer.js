import { getLocale } from 'modules/archive';
import { connect } from 'react-redux';

import Messages from './Messages';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
});

export default connect(mapStateToProps)(Messages);
