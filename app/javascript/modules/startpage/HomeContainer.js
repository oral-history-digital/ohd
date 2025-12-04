import { getInstitutions } from 'modules/data';
import { connect } from 'react-redux';

import Home from './Home';

const mapStateToProps = (state) => ({
    institutions: getInstitutions(state),
});

export default connect(mapStateToProps)(Home);
