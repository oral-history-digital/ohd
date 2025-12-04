import { getEditView, getLocale, getProjectId } from 'modules/archive';
import {
    fetchData,
    getCurrentProject,
    getRegistryEntriesStatus,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SelectedRegistryReferences from './SelectedRegistryReferences';

const mapStateToProps = (state) => ({
    project: getCurrentProject(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    editView: getEditView(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectedRegistryReferences);
