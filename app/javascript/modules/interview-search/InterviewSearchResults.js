import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import ResultList from './ResultList';
import modelsWithResults from './modelsWithResults';
import TranscriptResult from './TranscriptResult';
import AnnotationResult from './AnnotationResult';
import RegistryResult from './RegistryResult';
import PhotoResult from './PhotoResult';
import TocResult from './TocResult';

export default function InterviewSearchResults({
    currentInterviewSearchResults,
    segmentResults,
    registryEntryResults,
    photoResults,
    biographyResults,
    annotationResults,
    numObservationsResults,
}) {
    const filteredModelNames = modelsWithResults(currentInterviewSearchResults);

    const { t, locale } = useI18n();

    if (filteredModelNames.length === 0 && numObservationsResults === 0) {
        return (
            <div>{t('modules.interview_search.no_results')}</div>
        );
    }

    const filteredSegments = segmentResults.filter(segment => segment.text[locale] !== '');
    const toc = segmentResults.filter(segment => segment.text[locale] === '');

    return (
        <div>
            <ResultList
                tKey="segment"
                searchResults={filteredSegments}
                component={TranscriptResult}
            />
            <ResultList
                tKey="heading"
                searchResults={toc}
                component={TocResult}
            />
            <ResultList
                tKey="annotation"
                searchResults={annotationResults}
                component={AnnotationResult}
            />
            <ResultList
                tKey="registryentry"
                searchResults={registryEntryResults}
                component={RegistryResult}
            />
            <ResultList
                tKey="biographicalentry"
                searchResults={biographyResults}
            />
            <ResultList
                tKey="photo"
                searchResults={photoResults}
                component={PhotoResult}
            />
            {numObservationsResults > 0 &&
                <p style={{ fontSize: '1rem', marginLeft: '1.5rem' }}>
                    {`${numObservationsResults} ${t('observation_results')}`}
                </p>
            }
        </div>
    );
}

InterviewSearchResults.propTypes = {
    currentInterviewSearchResults: PropTypes.object.isRequired,
    segmentResults: PropTypes.array,
    registryEntryResults: PropTypes.array,
    photoResults: PropTypes.array,
    biographyResults: PropTypes.array,
    annotationResults: PropTypes.array,
    numObservationsResults: PropTypes.number,
};
