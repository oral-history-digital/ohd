import { connect } from 'react-redux';

import Locations from '../components/Locations';

const mapStateToProps = (state, ownProps) => {
    let data = {}
    if(ownProps.data) {
        data = ownProps.data
    } else {
        data = state.search.allInterviewsPlacesOfBirth
    }
    return { 
        data: data,
        locale: state.archive.locale,
        visible: state.flyoutTabs.visible,
    }
}

export default connect(mapStateToProps)(Locations);
