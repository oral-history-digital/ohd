import { getCurrentUser } from 'modules/data';
import { connect } from 'react-redux';

import UserDetails from './UserDetails';

const mapStateToProps = (state) => ({
    user: getCurrentUser(state),
});

export default connect(mapStateToProps)(UserDetails);
