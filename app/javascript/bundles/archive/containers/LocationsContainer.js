import { connect } from 'react-redux';

import Locations from '../components/Locations';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        visible: state.flyoutTabs.visible,
    }
}

export default connect(mapStateToProps)(Locations);
