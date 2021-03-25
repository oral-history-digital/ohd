import { connect } from 'react-redux';

import { getLocale, getSelectedArchiveIds, getTranslations, getEditView } from 'modules/archive';
import MapTabPanel from './MapTabPanel';

const mapStateToProps = (state) => ({
    selectedArchiveIds: getSelectedArchiveIds(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    account: state.data.accounts.current,
    editView: getEditView(state),
});

export default connect(mapStateToProps)(MapTabPanel);
