import { createElement } from 'react';
import PropTypes from 'prop-types';

import { FoundSegmentContainer } from 'modules/transcript';
import { PersonContainer } from 'modules/people';
import { RegistryEntryContainer } from 'modules/registry';
import PhotoResult from './PhotoResult';
import BiographyResult from './BiographyResult';

const modelToComponent = {
    Segment: FoundSegmentContainer,
    Person: PersonContainer,
    BiographicalEntry: BiographyResult,
    Photo: PhotoResult,
    RegistryEntry: RegistryEntryContainer,
};

export default function ResultList({
    model,
    searchResults,
}) {
    return searchResults.map(data => createElement(
        modelToComponent[model],
        {
            key: data.id,
            data: data,
        }
    ));
}

ResultList.propTypes = {
    model: PropTypes.string.isRequired,
    searchResults: PropTypes.object.isRequired,
};
