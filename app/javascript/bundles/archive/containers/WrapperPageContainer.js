import { connect } from 'react-redux';

import WrapperPage from '../components/WrapperPage';
import { setLocale } from '../actions/wrapperPageActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
  return { 
    archiveId: state.archive.archiveId,
    transcriptScrollEnabled: state.archive.transcriptScrollEnabled,
    locales: state.archive.locales,
    locale: state.archive.locale
  }
}

const mapDispatchToProps = (dispatch) => ({
  setLocale: locale => dispatch(setLocale(locale)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WrapperPage);
