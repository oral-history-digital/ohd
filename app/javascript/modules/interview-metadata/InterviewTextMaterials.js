import { AuthShowContainer, useAuthorization } from 'modules/auth';
import { SingleValueWithFormContainer, StatusForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';

import InterviewDownloads from './InterviewDownloads';

export default function InterviewTextMaterials({
    interview,
    isCatalog,
    editView,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();

    const { isAuthorized } = useAuthorization();

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

    if (!interview.language_id) {
        return null;
    }

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
                <SingleValueWithFormContainer
                    obj={interview}
                    collapse
                    elementType="textarea"
                    multiLocale
                    attribute="observations"
                    value={interview.observations?.[locale]}
                    noLabel
                />
            )}
            {!isCatalog && showTranscriptPDF && (
                <AuthShowContainer ifLoggedIn>
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
    isCatalog: PropTypes.bool,
    editView: PropTypes.bool,
};
