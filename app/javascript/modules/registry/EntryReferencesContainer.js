import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId } from 'modules/archive';
import { getProjects } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import EntryReferences from './EntryReferences';

const mapStateToProps = state => ({
    isLoggedIn: getIsLoggedIn(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EntryReferences);

