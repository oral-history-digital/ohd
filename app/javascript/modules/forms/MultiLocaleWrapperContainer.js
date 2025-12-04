import { getProjectLocales } from 'modules/data';
import { connect } from 'react-redux';

import MultiLocaleWrapper from './MultiLocaleWrapper';

const mapStateToProps = (state) => ({
    locales: getProjectLocales(state),
});

export default connect(mapStateToProps)(MultiLocaleWrapper);
