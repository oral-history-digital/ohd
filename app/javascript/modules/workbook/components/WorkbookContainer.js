import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentAccount } from 'modules/data';
import { fetchWorkbook } from '../actions';
import { getWorkbookIsLoading, getWorkbookLoaded, getWorkbookAnnotations, getWorkbookSearches,
    getWorkbookInterviews } from '../selectors';
import Workbook from './Workbook';

const mapStateToProps = state => ({
    account: getCurrentAccount(state),
    workbookIsLoading: getWorkbookIsLoading(state),
    workbookLoaded: getWorkbookLoaded(state),
    workbookAnnotations: getWorkbookAnnotations(state),
    workbookSearches: getWorkbookSearches(state),
    workbookInterviews: getWorkbookInterviews(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchWorkbook,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Workbook);
