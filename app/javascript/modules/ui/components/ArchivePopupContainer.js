import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale } from 'modules/archive';
import ArchivePopup from './ArchivePopup';
import { closeArchivePopup } from '../actions';
import { getPopup } from '../selectors';

const mapStateToProps = state => ({
    locale: getLocale(state),
    popup: getPopup(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArchivePopup);
