import { connect } from 'react-redux';

import ArchiveLocations from '../components/ArchiveLocations';
import * as actionCreators from '../actions/searchActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        //interviews: state.search.interviews,
        foundInterviews: state.search.foundInterviews,
        fulltext:  state.search.query.fulltext,
        isArchiveSearching: state.search.isArchiveSearching
    }
}

// Don't forget to actually use connect!
// Note that we don't export Locations, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, actionCreators)(ArchiveLocations);
