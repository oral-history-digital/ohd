import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import { getArchiveFacets, getArchiveQuery, getMapQuery } from '../selectors';
import Facet from './Facet';

const mapStateToProps = state => ({
    facets: getArchiveFacets(state),
    query: getArchiveQuery(state),
    mapSearchQuery: getMapQuery(state),
    locale: getLocale(state),
});

export default connect(mapStateToProps)(Facet);
