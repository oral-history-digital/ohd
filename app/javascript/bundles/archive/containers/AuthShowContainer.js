import { connect } from 'react-redux';
import AuthShow from '../components/AuthShow';

const mapStateToProps = (state) => {
    return {
        authStatus: state.account,
        account: state.data.accounts.current,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthShow);
