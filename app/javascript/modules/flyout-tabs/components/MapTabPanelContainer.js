import { connect } from 'react-redux';

import MapTabPanel from './MapTabPanel';

const mapStateToProps = (state) => ({
    selectedArchiveIds: state.archive.selectedArchiveIds,
    locale: state.archive.locale,
    translations: state.archive.translations,
    account: state.data.accounts.current,
    editView: state.archive.editView,
});

export default connect(mapStateToProps)(MapTabPanel);
