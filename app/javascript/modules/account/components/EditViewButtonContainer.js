import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeToEditView } from 'modules/archive';
import { getCookie } from 'modules/persistence';
import { getCurrentAccount } from 'modules/data';
import EditViewButton from './EditViewButton';

const mapStateToProps = (state) => {
    return {
        account: getCurrentAccount(state),
        editViewCookie: getCookie('editView') === 'true',
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    changeToEditView,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditViewButton);

