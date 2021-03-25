import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import Facet from './Facet';

const mapStateToProps = (state) => {
    return {
        facets: state.search.archive.facets,
        query: state.search.archive.query,
        mapSearchQuery: state.search.map.query,
        locale: getLocale(state),
        translations: getTranslations(state),
    }
}

export default connect(mapStateToProps)(Facet);
