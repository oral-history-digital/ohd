import { connect } from 'react-redux';

import ArchiveSearch from '../components/ArchiveSearch';

const mapStateToProps = (state) => {
  return { 
    foundInterviews: state.archive.foundInterviews,
    interviews: state.archive.interviews,
  }
}

export default connect(mapStateToProps)(ArchiveSearch);
