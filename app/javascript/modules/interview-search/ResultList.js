import { createElement } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { FoundSegmentContainer } from 'modules/transcript';
import { PersonContainer } from 'modules/people';
import { BiographicalEntryContainer } from 'modules/interviewee-metadata';
import { PhotoContainer } from 'modules/gallery';
import { RegistryEntryContainer } from 'modules/registry';
import { pluralize } from 'modules/strings';
import { usePathBase } from 'modules/routes';

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
    withLink = false,
    setArchiveId,
}) {
    const pathBase = usePathBase();

    if (!searchResults[`found${pluralize(model)}`]) {
        return null;
    }

    let active = false;
    return searchResults[`found${pluralize(model)}`].map( (data) => {
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

        if (withLink) {
            return (
                <Link
                    key={data.id}
                    onClick={() => setArchiveId(interview.archive_id)}
                    to={`${pathBase}/interviews/${interview.archive_id}`}
                >
                    {result}
                </Link>
            )
        } else {
            return result;
        }
    });
}

ResultList.propTypes = {
    model: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    searchResults: PropTypes.object.isRequired,
    mediaTime: PropTypes.number.isRequired,
    withLink: PropTypes.bool,
    setArchiveId: PropTypes.func.isRequired,
};
