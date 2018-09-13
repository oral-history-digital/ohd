import { connect } from 'react-redux';
import InterviewRegistryReferences from '../components/InterviewRegistryReferences';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        editView: state.archive.editView,
        interview: getInterview(state),
        registryEntrySearchFacetIds: state.archive.registryEntrySearchFacetIds,
        registryReferenceTypeSearchFacets: state.archive.registryReferenceTypeSearchFacets,
        account: state.account,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewRegistryReferences);

