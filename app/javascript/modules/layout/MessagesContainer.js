import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import Messages from './Messages';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(Messages);
