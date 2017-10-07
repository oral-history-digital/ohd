import { connect } from 'react-redux';

import ArchiveSearch from '../components/ArchiveSearch';

const mapStateToProps = (state) => {
  return { 
    foundInterviews: state.archive.foundInterviews,
    interviews: state.archive.interviews,
    isArchiveSearching: state.archive.isArchiveSearching
  }
}

export default connect(mapStateToProps)(ArchiveSearch);
