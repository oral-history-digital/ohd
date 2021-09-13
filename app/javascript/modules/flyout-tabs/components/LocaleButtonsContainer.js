import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setLocale, getLocale } from 'modules/archive';
import { getProjectLocales } from 'modules/data';
import LocaleButtons from './LocaleButtons';

const mapStateToProps = state => ({
    currentLocale: getLocale(state),
    locales: getProjectLocales(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setLocale,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LocaleButtons);
