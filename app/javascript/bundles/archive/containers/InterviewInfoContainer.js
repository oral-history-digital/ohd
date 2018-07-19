import { connect } from 'react-redux';
import InterviewInfo from '../components/InterviewInfo';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        editView: state.archive.editView,
        interview: getInterview(state),
        people: state.data.people,
        people_status: state.data.people_status,
        contributions_last_deleted: state.data.contributions_last_deleted,
        contributionTypes: state.archive.contributionTypes,
        account: state.account,

    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewInfo);

