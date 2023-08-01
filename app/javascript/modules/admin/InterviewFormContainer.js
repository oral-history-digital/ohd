import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getCollectionsForCurrentProject,
    getContributionTypesForCurrentProject,
    getLanguages,
    submitData,
} from 'modules/data';
import InterviewForm from './InterviewForm';

const mapStateToProps = state => ({
    collections: getCollectionsForCurrentProject(state),
    contributionTypes: getContributionTypesForCurrentProject(state),
    languages: getLanguages(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);
