import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeToEditView } from 'modules/archive';
import { getCookie } from 'modules/persistence';
import { getCurrentUser } from 'modules/data';
import EditViewButton from './EditViewButton';

const mapStateToProps = (state) => {
    return {
        user: getCurrentUser(state),
        editViewCookie: getCookie('editView') === 'true',
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    changeToEditView,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditViewButton);

