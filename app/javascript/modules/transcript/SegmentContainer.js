import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getEditView } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import { getPeople } from 'modules/data';
import { getAutoScroll } from 'modules/interview';
import Segment from './Segment';

const mapStateToProps = state => ({
    locale: getLocale(state),
    people: getPeople(state),
    autoScroll: getAutoScroll(state),
    editView: getEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Segment);
