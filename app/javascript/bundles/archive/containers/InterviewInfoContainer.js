import { connect } from 'react-redux';
import InterviewInfo from '../components/InterviewInfo';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';

import { getInterview, getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        collections: state.data.collections,
        editView: getCookie('editView'),
        interview: getInterview(state),
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        // the following is just a trick to force rerender after deletion
        contributionsLastModified: state.data.statuses.contributions.lastModified,
        contributionTypes: state.archive.contributionTypes,
        registryEntryMetadataFields: state.archive.registryEntryMetadataFields,
        registryReferenceTypeMetadataFields: state.archive.registryReferenceTypeMetadataFields,
        account: state.data.accounts.current,
        detailViewFields: state.archive.detailViewFields,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewInfo);

