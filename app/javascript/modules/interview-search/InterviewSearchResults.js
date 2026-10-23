import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { showTranslationTab } from 'modules/interview';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import AnnotationResult from './AnnotationResult';
import PhotoResult from './PhotoResult';
import RegistryResult from './RegistryResult';
import ResultList from './ResultList';
import TocResult from './TocResult';
import TranscriptResult from './TranscriptResult';
import useInterviewSearch from './useInterviewSearch';

/**
 * Shows grouped interview search results, including available transcript translations.
 *
 * @param {Object} props - Result context.
 * @param {string} props.archiveId - Public interview identifier.
 * @param {Object} props.interview - Interview and transcript language metadata.
 * @returns {React.ReactElement|null} Result groups, request status, or an empty-result message.
 */
export default function InterviewSearchResults({ archiveId, interview }) {
    const { t, locale } = useI18n();
    const {
        project,
        isLoading: projectIsLoading,
        error: projectError,
    } = useProject({});
    const { fulltext } = useSearchParams();
    const {
        isLoading,
        error: searchError,
        numResults,
        segmentResults,
        headingResults,
        registryEntryResults,
        photoResults,
        biographyResults,
        annotationResults,
        observationsResults,
    } = useInterviewSearch(archiveId, fulltext, project);

    const error = projectError || searchError;
    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }

    if (projectIsLoading || !project || isLoading) {
        return <Spinner />;
    }

    if (numResults === 0) {
        return <div>{t('modules.interview_search.no_results')}</div>;
    }

    if (!interview) {
        return null;
    }

    const interviewLang = interview.alpha3;

    const originalTranscriptResults = segmentResults.filter(
        (segment) => segment.text[interviewLang]?.length > 0
    );

    const translatedTranscriptResultsPerLocale = interview.translation_alpha3s
        ?.map((resultLocale) => [
            resultLocale,
            segmentResults.filter(
                (segment) => segment.text[resultLocale]?.length > 0
            ),
        ])
        .filter(([, results]) => results.length > 0);

    return (
        <div
            className={classNames('LoadingOverlay', {
                'is-loading': isLoading,
            })}
        >
            {originalTranscriptResults?.length > 0 && (
                <ResultList
                    heading={t('segment_results')}
                    searchResults={originalTranscriptResults}
                    component={TranscriptResult}
                    locale={interviewLang}
                    className="u-mt"
                />
            )}
            {showTranslationTab(project, interview, locale) &&
                translatedTranscriptResultsPerLocale?.map(
                    ([resultLocale, results]) => (
                        <ResultList
                            key={resultLocale}
                            heading={t('translation_results')}
                            searchResults={results}
                            component={TranscriptResult}
                            locale={resultLocale}
                            className="u-mt"
                        />
                    )
                )}
            {headingResults.length > 0 && (
                <ResultList
                    heading={t('heading_results')}
                    searchResults={headingResults}
                    component={TocResult}
                    className="u-mt"
                />
            )}
            {annotationResults.length > 0 && (
                <ResultList
                    heading={t('annotation_results')}
                    searchResults={annotationResults}
                    component={AnnotationResult}
                    className="u-mt"
                />
            )}
            {registryEntryResults.length > 0 && (
                <ResultList
                    heading={t('registryentry_results')}
                    searchResults={registryEntryResults}
                    component={RegistryResult}
                    className="u-mt"
                />
            )}
            {biographyResults.length > 0 && (
                <p
                    className="u-mt u-ml"
                    style={{ fontSize: '1rem', lineHeight: '1.5rem' }}
                >
                    {`${biographyResults.length} ${t('biographicalentry_results')}`}
                </p>
            )}
            {photoResults.length > 0 && (
                <ResultList
                    heading={t('photo_results')}
                    searchResults={photoResults}
                    component={PhotoResult}
                    className="u-mt"
                />
            )}
            {observationsResults.length > 0 && (
                <p
                    className="u-mt u-ml"
                    style={{ fontSize: '1rem', lineHeight: '1.5rem' }}
                >
                    {`${observationsResults.length} ${t('observation_results')}`}
                </p>
            )}
        </div>
    );
}

InterviewSearchResults.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
};
