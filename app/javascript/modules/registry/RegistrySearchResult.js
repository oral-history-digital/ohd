import PropTypes from 'prop-types';

import RegistryEntryBreadcrumbs from './RegistryEntryBreadcrumbs';
import RegistryEntryContainer from './RegistryEntryContainer';

export default function RegistrySearchResult({
    result,
    hideCheckbox,
    hideEditButtons,
}) {
    return (
        <RegistryEntryContainer
            className="RegistryEntry--searchResult"
            data={result}
            hideCheckbox={hideCheckbox}
            hideEditButtons={hideEditButtons}
        >
            <RegistryEntryBreadcrumbs registryEntry={result} />
        </RegistryEntryContainer>
    );
}

RegistrySearchResult.propTypes = {
    result: PropTypes.object,
    hideCheckbox: PropTypes.bool,
    hideEditButtons: PropTypes.bool,
};
