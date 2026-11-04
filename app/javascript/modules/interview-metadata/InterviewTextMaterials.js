import { AuthShowContainer, useAuthorization } from 'modules/auth';
import { SingleValueWithForm, StatusForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import InterviewDownloads from './InterviewDownloads';

/**
 * Shows permitted observation and transcript downloads and their editing controls.
 *
 * @param {Object} props - Interview materials context.
 * @param {Object} props.interview - Interview text and publication settings.
 * @param {boolean} [props.editView] - Whether observation editing is visible.
 * @returns {React.ReactElement|null} Materials, project request status, or nothing without an interview language.
 */
export default function InterviewTextMaterials({ interview, editView }) {
    const { t, locale } = useI18n();
    const { project, isLoading, error } = useProject();

    const { isAuthorized } = useAuthorization();

    if (!interview.language_id) return null;
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
    if (isLoading || !project) return <Spinner />;

    const canEditInterview = isAuthorized(interview, 'update');
    const isObservationsPublic =
        interview.properties?.public_attributes?.observations?.toString() ===
        'true';
    const isTranscriptPublic =
        interview.properties?.public_attributes?.transcript?.toString() ===
        'true';
    const hasObservationsInLocale = Boolean(interview.observations?.[locale]);

    const showObservations =
        canEditInterview || (isObservationsPublic && hasObservationsInLocale);
    const showTranscriptPDF =
        !project.is_catalog && (canEditInterview || isTranscriptPublic);

    const localesWithObservations = interview.observations
        ? project.available_locales.filter((lang) => {
              const content = interview.observations[lang];
              return content?.trim();
          })
        : [];

    return (
        <>
            {showObservations && (
                <p key="observations-downloads" id="observations-downloads">
                    <span className="flyout-content-label">
                        {t('activerecord.attributes.interview.observations')}:
                    </span>
                    {localesWithObservations.map((lang) => (
                        <InterviewDownloads
                            key={lang}
                            lang={lang}
                            type="observations"
                            condition={showObservations}
                            showEmpty={true}
                        />
                    ))}
                </p>
            )}
            {editView && (
                <SingleValueWithForm
                    obj={interview}
                    collapse
                    elementType="textarea"
                    multiLocale
                    attribute="observations"
                    value={interview.observations?.[locale]}
                    noLabel
                />
            )}
            {showTranscriptPDF &&
                interview.alpha3s_with_transcript?.length > 0 && (
                    <AuthShowContainer hasProjectAccess>
                        <p key="transcript-downloads" id="transcript-downloads">
                            <span className="flyout-content-label">
                                {t('transcript')}:
                            </span>
                            {interview.alpha3s_with_transcript.map((lang) => {
                                return (
                                    <InterviewDownloads
                                        key={lang}
                                        lang={lang}
                                        type="transcript"
                                        condition={showTranscriptPDF}
                                        showEmpty={true}
                                    />
                                );
                            })}
                            <StatusForm
                                data={interview}
                                scope="interview"
                                attribute="public_transcript"
                                value={
                                    interview.properties?.public_attributes?.transcript?.toString() ===
                                    'true'
                                }
                            />
                        </p>
                    </AuthShowContainer>
                )}
        </>
    );
}

InterviewTextMaterials.propTypes = {
    interview: PropTypes.object.isRequired,
    editView: PropTypes.bool,
};
