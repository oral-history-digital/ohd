import { connect } from 'react-redux';

import FlyoutTabs from '../components/FlyoutTabs';


// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {

    return {
        visible: state.flyoutTabs.visible
    }
}

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps)(FlyoutTabs);