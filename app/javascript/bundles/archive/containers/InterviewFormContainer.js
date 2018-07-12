import { connect } from 'react-redux';

import InterviewForm from '../components/InterviewForm';
import { submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        collections: state.archive.collections,
        languages: state.archive.languages,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (params) => dispatch(submitData(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);
