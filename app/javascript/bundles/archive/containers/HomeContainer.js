import { connect } from 'react-redux';

import Home from '../components/Home';


// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {

    return {
        homeContent: state.archive.homeContent[state.archive.locale],
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.account
    }
}

const mapDispatchToProps = (dispatch) => ({
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(Home);
