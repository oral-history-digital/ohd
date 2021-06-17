import { createElement } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Disclosure } from 'modules/ui';
import { PersonContainer } from 'modules/people';
import PhotoResult from './PhotoResult';
import BiographyResult from './BiographyResult';
import RegistryResult from './RegistryResult';
import TranscriptResult from './TranscriptResult';
import HeadingResult from './HeadingResult';

const modelToComponent = {
    Segment: TranscriptResult,
    Heading: HeadingResult,
    Person: PersonContainer,
    BiographicalEntry: BiographyResult,
    Photo: PhotoResult,
    RegistryEntry: RegistryResult,
};

export default function ResultList({
    model,
    searchResults,
    onlyStats = false,
}) {
    const { t } = useI18n();

    if (!searchResults || searchResults.length === 0) {
        return null;
    }

    const title = `${searchResults.length} ${t(`${model.toLowerCase()}_results`)}`;

    if (onlyStats) {
        return (
            <p style={{ fontSize: '1rem', marginLeft: '1.5rem' }}>
                {title}
            </p>
        );
    }

    return (
        <Disclosure title={title}>
            {
                searchResults.map(data => createElement(
                    modelToComponent[model],
                    {
                        key: data.id,
                        data: data,
                    }
                ))
            }
        </Disclosure>
    );
}

ResultList.propTypes = {
    model: PropTypes.string.isRequired,
    searchResults: PropTypes.object.isRequired,
    onlyStats: PropTypes.bool,
};
