import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData } from 'modules/data';
import SegmentForm from './SegmentForm';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    people: state.data.people,
    projectId: state.archive.projectId,
    projects: state.data.projects,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SegmentForm);
