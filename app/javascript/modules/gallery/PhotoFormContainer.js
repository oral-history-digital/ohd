import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeArchivePopup } from 'modules/ui';
import { submitData } from 'modules/data';
import PhotoForm from './PhotoForm';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PhotoForm);
