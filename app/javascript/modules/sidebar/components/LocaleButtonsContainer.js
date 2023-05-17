import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setLocale } from 'modules/archive';
import LocaleButtons from './LocaleButtons';

const mapDispatchToProps = dispatch => bindActionCreators({
    setLocale,
}, dispatch);

export default connect(null, mapDispatchToProps)(LocaleButtons);
