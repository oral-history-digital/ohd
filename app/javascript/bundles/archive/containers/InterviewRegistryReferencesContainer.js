import { connect } from 'react-redux';
import InterviewRegistryReferences from '../components/InterviewRegistryReferences';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';

import { getInterview, getInterviewee } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        editView: state.archive.editView,
        interview: getInterview(state),
        interviewee: getInterviewee({interview: getInterview(state), people: state.data.people, contributionTypes: state.archive.contributionTypes}),
        registryEntryMetadataFields: state.archive.registryEntryMetadataFields,
        registryReferenceTypeMetadataFields: state.archive.registryReferenceTypeMetadataFields,
        account: state.data.accounts.current,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewRegistryReferences);

