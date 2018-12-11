import { connect } from 'react-redux';
import ExportInterview from '../components/ExportInterview';
import { submitDois } from '../actions/archiveActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        doiResult: state.archive.doiResult
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitDois: (params, locale) => dispatch(submitDois(params, locale)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExportInterview);
