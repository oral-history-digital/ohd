import { getEditView } from 'modules/archive';
import { fetchData, getRegistryEntriesStatus } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SelectedRegistryReferences from './SelectedRegistryReferences';

const mapStateToProps = (state) => ({
    registryEntriesStatus: getRegistryEntriesStatus(state),
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
