import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId } from 'modules/archive';
import { fetchData, getProjects, getCurrentAccount } from 'modules/data';
import Workbook from './Workbook';
import { getUserContentsStatus } from '../data';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    userContentsStatus: getUserContentsStatus(state).all,
    locale: getLocale(state),
    account: getCurrentAccount(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Workbook);
