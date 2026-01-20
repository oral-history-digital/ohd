import { getLocale } from 'modules/archive';
import { getLoggedInAt } from 'modules/user';
import { connect } from 'react-redux';

import Messages from './Messages';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    loggedInAt: getLoggedInAt(state),
});

export default connect(mapStateToProps)(Messages);
