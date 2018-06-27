import { connect } from 'react-redux';

import Facet from '../components/Facet';

const mapStateToProps = (state) => {
    return { 
        facets: state.search.facets,
        query: state.search.query,
        locale: state.archive.locale,
        translations: state.archive.translations
    }
}

export default connect(mapStateToProps, null)(Facet);
