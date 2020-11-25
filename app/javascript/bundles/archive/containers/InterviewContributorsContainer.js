import { connect } from 'react-redux';
import InterviewContributors from '../components/InterviewContributors';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, submitData } from '../actions/dataActionCreators';
import { getContributorsFetched } from '../selectors/interviewSelectors';

import { getInterview  } from 'lib/utils';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
    editView: state.archive.editView,
    interview: getInterview(state),
    people: state.data.people,
    contributorsFetched: getContributorsFetched(state),
    account: state.data.accounts.current,
    contributionTypes: state.archive.contributionTypes,
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    submitData: (props, params) => dispatch(submitData(props, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InterviewContributors);
