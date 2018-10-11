import { connect } from 'react-redux';

import RegistryEntryShow from '../components/RegistryEntryShow';
import { fetchData } from '../actions/dataActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { setArchiveId } from '../actions/archiveActionCreators';
import { setTapeAndTime } from '../actions/interviewActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        interviews: state.data.interviews,
        interviewsStatus: state.data.statuses && state.data.statuses.interviews,
        segments: state.data.segments,
        segmentsStatus: state.data.statuses && state.data.statuses.segments,
        translations: state.archive.translations,
        registryReferenceTypes: state.data.registry_reference_types,
        registryReferenceTypesStatus: state.data.statuses.registry_reference_types.all,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryShow);
