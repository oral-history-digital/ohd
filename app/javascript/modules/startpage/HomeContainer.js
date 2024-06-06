import { connect } from 'react-redux';

import Home from './Home';
import { getInstitutions } from 'modules/data';

const mapStateToProps = state => ({
    institutions: getInstitutions(state),
});

export default connect(mapStateToProps)(Home);
