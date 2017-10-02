import { connect } from 'react-redux';

import TableOfContents from '../components/TableOfContents';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
  return { 
    archiveId: state.archive.archiveId,
    interview: ArchiveUtils.getInterview(state),
  }
}

export default connect(mapStateToProps)(TableOfContents);
