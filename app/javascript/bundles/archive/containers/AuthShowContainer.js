import { connect } from 'react-redux';
import AuthShow from '../components/AuthShow';

const mapStateToProps = (state) => {
    return {
        account: state.account,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthShow);
