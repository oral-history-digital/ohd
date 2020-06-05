import { connect } from 'react-redux';

import Facet from '../components/Facet';

const mapStateToProps = (state) => {
    return { 
        facets: state.search.archive.facets,
        query: state.search.archive.query,
        mapSearchQuery: state.search.map.query,
        locale: state.archive.locale,
        translations: state.archive.translations
    }
}

export default connect(mapStateToProps, null)(Facet);
