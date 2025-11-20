import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getSelectedRegistryEntryIds } from 'modules/archive';
import { submitData } from 'modules/data';
import MergeRegistryEntriesButton from './MergeRegistryEntriesButton';

const mapStateToProps = (state) => ({
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MergeRegistryEntriesButton);
