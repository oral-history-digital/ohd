import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import RegistrySearchResult from './RegistrySearchResult';

const mapStateToProps = state => ({
    locale: getLocale(state),
});

export default connect(mapStateToProps)(RegistrySearchResult);
