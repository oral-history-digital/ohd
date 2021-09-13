import { connect } from 'react-redux';

import { getProjectLocales, getProjectHasMap } from 'modules/data';
import { getLocale, getTranslations } from 'modules/archive';
import EditInterview from './EditInterview';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    translations: getTranslations(state),
    hasMap: getProjectHasMap(state),
});

export default connect(mapStateToProps)(EditInterview);
