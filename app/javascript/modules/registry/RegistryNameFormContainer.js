import {
    FetchProjectResource,
    getNormDataProviders,
    getRegistryNameTypesForCurrentProject,
} from 'modules/data';
import { getRegistryEntriesSearch, searchRegistryEntry } from 'modules/search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RegistryNameForm from './RegistryNameForm';

const mapStateToProps = (state) => ({
    registryNameTypes: getRegistryNameTypesForCurrentProject(state),
    normDataProviders: getNormDataProviders(state),
    foundRegistryEntries: getRegistryEntriesSearch(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            searchRegistryEntry,
        },
        dispatch
    );

const ReadyForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistryNameForm);

/**
 * Loads name-type choices before showing the registry-name editor.
 * @param {Object} props - Editor values and callbacks forwarded unchanged.
 * @returns {React.ReactElement} Editor or resource loading indicator.
 */
export default function RegistryNameFormContainer(props) {
    return (
        <FetchProjectResource resource="registry_name_types">
            <ReadyForm {...props} />
        </FetchProjectResource>
    );
}
