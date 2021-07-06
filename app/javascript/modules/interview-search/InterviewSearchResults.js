import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { searchResultCount } from 'modules/interview-preview';
import ResultList from './ResultList';
import TranscriptResult from './TranscriptResult';
import AnnotationResult from './AnnotationResult';
import RegistryResult from './RegistryResult';
import PhotoResult from './PhotoResult';
import TocResult from './TocResult';

export default function InterviewSearchResults({
    currentInterviewSearchResults,
    segmentResults,
    headingResults,
    registryEntryResults,
    photoResults,
    biographyResults,
    annotationResults,
    observationsResults,
}) {
    const { t } = useI18n();

    const numResults = searchResultCount(currentInterviewSearchResults);

    if (numResults === 0) {
        return (
            <div>{t('modules.interview_search.no_results')}</div>
        );
    }

    return (
        <div>
            {segmentResults.length > 0 && (
                <ResultList
                    tKey="segment"
                    searchResults={segmentResults}
                    component={TranscriptResult}
                    className="u-mt"
                />
            )}
            {headingResults.length > 0 && (
                <ResultList
                    tKey="heading"
                    searchResults={headingResults}
                    component={TocResult}
                    className="u-mt"
                />
            )}
            {annotationResults.length > 0 && (
                <ResultList
                    tKey="annotation"
                    searchResults={annotationResults}
                    component={AnnotationResult}
                    className="u-mt"
                />
            )}
            {registryEntryResults.length > 0 && (
                <ResultList
                    tKey="registryentry"
                    searchResults={registryEntryResults}
                    component={RegistryResult}
                    className="u-mt"
                />
            )}
            {biographyResults.length > 0 && (
                <p className="u-mt u-ml" style={{ fontSize: '1rem', lineHeight: '1.5rem' }}>
                    {`${biographyResults.length} ${t('biographicalentry_results')}`}
                </p>
            )}
            {photoResults.length > 0 && (
                <ResultList
                    tKey="photo"
                    searchResults={photoResults}
                    component={PhotoResult}
                    className="u-mt"
                />
            )}
            {observationsResults.length > 0 && (
                <p className="u-mt u-ml" style={{ fontSize: '1rem', lineHeight: '1.5rem' }}>
                    {`${observationsResults.length} ${t('observation_results')}`}
                </p>
            )}
        </div>
    );
}

InterviewSearchResults.propTypes = {
    currentInterviewSearchResults: PropTypes.object.isRequired,
    segmentResults: PropTypes.array,
    headingResults: PropTypes.array,
    registryEntryResults: PropTypes.array,
    photoResults: PropTypes.array,
    biographyResults: PropTypes.array,
    annotationResults: PropTypes.array,
    observationsResults: PropTypes.array,
};
