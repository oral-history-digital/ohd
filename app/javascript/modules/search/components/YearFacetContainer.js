import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import { getArchiveQuery, getMapQuery } from '../selectors';
import YearFacet from './YearFacet';

const mapStateToProps = state => ({
    query: getArchiveQuery(state),
    mapSearchQuery: getMapQuery(state),
    locale: getLocale(state),
});

export default connect(mapStateToProps)(YearFacet);
