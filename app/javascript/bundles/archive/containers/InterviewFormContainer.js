import { connect } from 'react-redux';

import InterviewForm from '../components/InterviewForm';
import { submitInterview } from '../actions/interviewActionCreators';

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
    submitInterview: (params) => dispatch(submitInterview(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);
