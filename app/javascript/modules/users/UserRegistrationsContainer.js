import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getUserRegistrationsQuery } from 'modules/search';
import { fetchData, getCurrentProject, getUserRegistrations, getUserRegistrationsStatus } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import UserRegistrations from './UserRegistrations';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    userRegistrations: getUserRegistrations(state),
    resultPagesCount: getUserRegistrationsStatus(state).resultPagesCount,
    query: getUserRegistrationsQuery(state),
    isUserRegistrationSearching: state.search.isUserRegistrationSearching,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrations);
