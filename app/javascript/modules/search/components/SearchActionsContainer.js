import { connect } from 'react-redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import { getArchiveFacets, getArchiveQuery } from '../selectors';
import SearchActions from './SearchActions';

const mapStateToProps = state => ({
    query: getArchiveQuery(state),
    facets: getArchiveFacets(state),
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
});

export default connect(mapStateToProps)(SearchActions);
