import { connect } from 'react-redux';

import { getLocale, getSelectedArchiveIds, getTranslations, getEditView } from 'modules/archive';
import { getCurrentAccount, getCurrentProject } from 'modules/data';
import MapTabPanel from './MapTabPanel';

const mapStateToProps = (state) => ({
    selectedArchiveIds: getSelectedArchiveIds(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(MapTabPanel);
