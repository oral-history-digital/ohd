import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData, getContributionTypes,
    getPeopleStatus, getPeople, getProjects } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import ContributionForm from './ContributionForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    people: getPeople(state),
    peopleStatus: getPeopleStatus(state),
    contributionTypes: getContributionTypes(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    closeArchivePopup,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ContributionForm);
