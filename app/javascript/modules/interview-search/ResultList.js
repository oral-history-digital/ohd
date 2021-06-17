import { createElement } from 'react';
import PropTypes from 'prop-types';

import { PersonContainer } from 'modules/people';
import PhotoResult from './PhotoResult';
import BiographyResult from './BiographyResult';
import RegistryResult from './RegistryResult';
import TranscriptResult from './TranscriptResult';

const modelToComponent = {
    Segment: TranscriptResult,
    Person: PersonContainer,
    BiographicalEntry: BiographyResult,
    Photo: PhotoResult,
    RegistryEntry: RegistryResult,
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
