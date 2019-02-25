import { connect } from 'react-redux';
import AuthShow from '../components/AuthShow';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return {
        authStatus: state.account,
        account: state.data.accounts.current,
        accountsStatus: state.data.statuses.accounts,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthShow);
