import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import SearchActions from './SearchActions';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
});

export default connect(mapStateToProps)(SearchActions);
