import { createElement } from 'react';
import PropTypes from 'prop-types';

import { FoundSegmentContainer } from 'modules/transcript';
import { PersonContainer } from 'modules/people';
import { BiographicalEntryContainer } from 'modules/interviewee-metadata';
import { PhotoContainer } from 'modules/gallery';
import { RegistryEntryContainer } from 'modules/registry';

const modelToComponent = {
    Segment: FoundSegmentContainer,
    Person: PersonContainer,
    BiographicalEntry: BiographicalEntryContainer,
    Photo: PhotoContainer,
    RegistryEntry: RegistryEntryContainer,
};

export default function ResultList({
    model,
    interview,
    searchResults,
    mediaTime,
}) {
    let active = false;
    return searchResults.map(data => {
        if (model === 'Segment') {
            if (data.time <= mediaTime + 10 && data.time >= mediaTime - 5) {
                active = true;
            }
        }

        const result = createElement(modelToComponent[model],
            {
                key: data.id,
                data: data,
                tape_count: interview.tape_count,
                active: false,
                // TODO: reintegrate counter with different models
                //index: index+1,
                //foundSegmentsAmount: searchResults.foundSegments.length
            }
        )

        return result;
    });
}

ResultList.propTypes = {
    model: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    searchResults: PropTypes.object.isRequired,
    mediaTime: PropTypes.number.isRequired,
    setArchiveId: PropTypes.func.isRequired,
};
