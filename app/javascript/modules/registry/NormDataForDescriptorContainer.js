import {
    FetchProjectResource,
    getNormDataProviders,
    getRegistryNameTypesForCurrentProject,
} from 'modules/data';
import { connect } from 'react-redux';

import NormDataForDescriptor from './NormDataForDescriptor';

const mapStateToProps = (state) => ({
    normDataProviders: getNormDataProviders(state),
    registryNameTypes: getRegistryNameTypesForCurrentProject(state),
});

const ReadyForm = connect(mapStateToProps)(NormDataForDescriptor);

/**
 * Loads name-type choices before searching authority data for a descriptor.
 * @param {Object} props - Editor values and callbacks forwarded unchanged.
 * @returns {React.ReactElement} Editor or resource loading indicator.
 */
export default function NormDataForDescriptorContainer(props) {
    return (
        <FetchProjectResource resource="registry_name_types">
            <ReadyForm {...props} />
        </FetchProjectResource>
    );
}
