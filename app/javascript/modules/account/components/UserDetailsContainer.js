import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { openArchivePopup } from 'bundles/archive/actions/archivePopupActionCreators';
import { getCurrentAccount } from 'bundles/archive/selectors/dataSelectors';
import UserDetails from './UserDetails';

const mapStateToProps = state => ({
    account: getCurrentAccount(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    openArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
