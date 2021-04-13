import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getArchiveFacets, getArchiveQuery, getMapQuery } from '../selectors';
import Facet from './Facet';

const mapStateToProps = (state) => {
    return {
        facets: getArchiveFacets(state),
        query: getArchiveQuery(state),
        mapSearchQuery: getMapQuery(state),
        locale: getLocale(state),
        translations: getTranslations(state),
    }
}

export default connect(mapStateToProps)(Facet);
