import { connect } from 'react-redux';

import Locations from '../components/Locations';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
    }
}

export default connect(mapStateToProps)(Locations);
