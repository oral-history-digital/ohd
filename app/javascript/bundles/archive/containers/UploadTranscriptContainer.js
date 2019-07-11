import { connect } from 'react-redux';

import UploadTranscript from '../components/UploadTranscript';
import { submitData, returnToForm } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        collections: state.archive.collections,
        languages: state.archive.languages,
        account: state.data.accounts.current,
        processing: state.data.statuses.uploads.processing, 
        lastModified: state.data.statuses.uploads.lastModified, 
        people: state.data.people,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (params) => dispatch(submitData(params)),
    returnToForm: (dataType) => dispatch(returnToForm(dataType))
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadTranscript);
