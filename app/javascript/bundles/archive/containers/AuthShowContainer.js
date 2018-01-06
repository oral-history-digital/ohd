import { connect } from 'react-redux';
import AuthShow from '../components/AuthShow';
import { fetchAccount } from '../actions/accountActionCreators';

const mapStateToProps = (state) => {
    return {
        account: state.account,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchAccount: () => dispatch(fetchAccount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthShow);
