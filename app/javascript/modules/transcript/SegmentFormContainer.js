import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId } from 'modules/archive';
import { submitData } from 'modules/data';
import SegmentForm from './SegmentForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    people: state.data.people,
    projectId: getProjectId(state),
    projects: state.data.projects,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SegmentForm);
