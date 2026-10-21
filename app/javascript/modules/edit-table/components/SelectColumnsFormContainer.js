import { getCurrentInterview } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setColumnsWithCookie } from '../actions';
import { getSelectedColumns } from '../selectors';
import SelectColumnsForm from './SelectColumnsForm';

const mapStateToProps = (state) => ({
    selectedColumns: getSelectedColumns(state),
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            setColumnsWithCookie,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(SelectColumnsForm);
