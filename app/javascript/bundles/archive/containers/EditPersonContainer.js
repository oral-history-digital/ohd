import { connect } from 'react-redux';

import EditPerson from '../components/EditPerson';
import { submitPerson } from '../actions/interviewActionCreators';

//import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    return { 
        //data: ArchiveUtils.getPerson(state),
        locale: state.archive.locale,
        locales: state.archive.locales,
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        collections: state.archive.collections,
        languages: state.archive.languages,
        account: state.account,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitPerson: (params) => dispatch(submitPerson(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditPerson);
