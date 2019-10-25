import { connect } from 'react-redux';

import SegmentForm from '../components/SegmentForm';
import { submitData } from '../actions/dataActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        people: state.data.people,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(SegmentForm);
