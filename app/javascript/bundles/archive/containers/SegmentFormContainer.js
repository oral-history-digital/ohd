import { connect } from 'react-redux';

import SegmentForm from '../components/SegmentForm';
import { submitData } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        people: state.data.people,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(SegmentForm);
