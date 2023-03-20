import { connect } from 'react-redux';

import { getCurrentUser } from 'modules/data';
import UserDetails from './UserDetails';

const mapStateToProps = state => ({
    user: getCurrentUser(state),
});

export default connect(mapStateToProps)(UserDetails);
