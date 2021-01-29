import { connect } from 'react-redux';

import { getCurrentAccount } from 'bundles/archive/selectors/dataSelectors';
import UserDetails from './UserDetails';

const mapStateToProps = state => ({
    account: getCurrentAccount(state),
});

export default connect(mapStateToProps)(UserDetails);
