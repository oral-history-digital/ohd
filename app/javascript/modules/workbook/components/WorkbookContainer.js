import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentAccount } from 'modules/data';
import { fetchWorkbook } from '../actions';
import { getWorkbookIsLoading, getWorkbookLoaded } from '../selectors';
import Workbook from './Workbook';

const mapStateToProps = state => ({
    account: getCurrentAccount(state),
    workbookIsLoading: getWorkbookIsLoading(state),
    workbookLoaded: getWorkbookLoaded(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchWorkbook,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Workbook);
