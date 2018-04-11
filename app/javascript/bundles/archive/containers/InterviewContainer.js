import { connect } from 'react-redux';

import Interview from '../components/Interview';
import { fetchInterview } from '../actions/interviewActionCreators';
import { fetchUserContents } from '../actions/userContentActionCreators';

import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        data: ArchiveUtils.getInterview(state),
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.account,
        userContents: state.userContent.contents,
        fetchedUserContents: state.userContent.fetched,
        isFetchingUserContents: state.userContent.isFetchingUserContents,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchUserContents: () => dispatch(fetchUserContents()),
    fetchInterview: (archiveId) => dispatch(fetchInterview(archiveId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
