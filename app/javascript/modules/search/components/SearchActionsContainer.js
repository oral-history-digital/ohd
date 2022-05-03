import { connect } from 'react-redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import SearchActions from './SearchActions';

const mapStateToProps = state => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
});

export default connect(mapStateToProps)(SearchActions);
