import {connect} from 'react-redux';

import InterviewTabs from '../components/InterviewTabs';

import { getInterview } from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    let data = state.search.interviews[state.archive.archiveId];
    return {
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        locale: state.archive.locale,
        interview: getInterview(state),
        interviewFulltext: data && data.fulltext,

    }
}

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps)(InterviewTabs);
