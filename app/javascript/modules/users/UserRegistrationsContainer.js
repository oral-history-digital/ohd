import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams } from 'modules/search';
import { fetchData, getProjects } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import UserRegistrations from './UserRegistrations';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    userRegistrations: state.data.user_registrations,
    resultPagesCount: state.data.statuses.user_registrations.resultPagesCount,
    query: state.search.user_registrations.query,
    isUserRegistrationSearching: state.search.isUserRegistrationSearching,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrations);
