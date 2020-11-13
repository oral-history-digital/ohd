import { connect } from 'react-redux';

import UserContentTabPanel from '../../components/flyout-tabs/UserContentTabPanel';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
});

export default connect(mapStateToProps)(UserContentTabPanel);
