import {
    FetchProjectResource,
    getNormDataProviders,
    getRegistryNameTypesForCurrentProject,
} from 'modules/data';
import { searchRegistryEntry } from 'modules/search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NormDataSelect from './NormDataSelect';

const mapStateToProps = (state) => ({
    normDataProviders: getNormDataProviders(state),
    registryNameTypes: getRegistryNameTypesForCurrentProject(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            searchRegistryEntry,
        },
        dispatch
    );

const ReadyForm = connect(mapStateToProps, mapDispatchToProps)(NormDataSelect);

/**
 * Loads name-type choices before importing an authority-data name.
 * @param {Object} props - Editor values and callbacks forwarded unchanged.
 * @returns {React.ReactElement} Editor or resource loading indicator.
 */
export default function NormDataSelectContainer(props) {
    return (
        <FetchProjectResource resource="registry_name_types">
            <ReadyForm {...props} />
        </FetchProjectResource>
    );
}
