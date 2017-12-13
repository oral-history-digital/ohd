import { connect } from 'react-redux';
import InterviewSearch from '../components/InterviewSearch';


// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    let data = state.search.interviews[state.archive.archiveId];
    return {
        foundSegments: data && data.foundSegments,
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps)(InterviewSearch);
