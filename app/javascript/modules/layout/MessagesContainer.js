import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getIsRegistered } from 'modules/user';
import Messages from './Messages';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    isRegistered: getIsRegistered(state),
});

export default connect(mapStateToProps)(Messages);
