import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { AuthShowContainer, AuthorizedContent, useAuthorization } from 'modules/auth';
import { SingleValueWithFormContainer, StatusForm } from 'modules/forms';
import { useProject } from 'modules/routes';
import InterviewDownloads from './InterviewDownloads';

export default function InterviewTextMaterials({
    interview,
    isCatalog,
    editView,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();

    const { isAuthorized } = useAuthorization();
    const showObservations = isAuthorized(interview, 'update') || (
        interview.properties?.public_attributes?.observations?.toString() === 'true' &&
        interview.observations?.[locale]
    );
    const showTranscriptPDF = !project.is_catalog && (
        isAuthorized(interview, 'update') ||
        interview.properties?.public_attributes?.transcript?.toString() === 'true'
    );
        

    if (!interview.language_id) {
        return null;
    }

    return (
        <>
            {showObservations && (
                <p>
                    <span className='flyout-content-label'>{t('activerecord.attributes.interview.observations')}:</span>
                    { interview.observations && Object.keys(interview.observations).map( locale => {
                        if (interview.observations[locale]) {
                            return (
                                <InterviewDownloads
                                    key={locale}
                                    lang={locale}
                                    type='observations'
                                    condition={showObservations}
                                    showEmpty={true}
                                />
                            )
                        }
                    })}
                </p>
            )}
            { editView && <SingleValueWithFormContainer
                obj={interview}
                collapse
                elementType="textarea"
                multiLocale
                attribute="observations"
                value={interview.observations?.[locale]}
                noLabel
            /> }
            {!isCatalog && showTranscriptPDF && (
                <AuthShowContainer ifLoggedIn>
                    <p>
                        <span className='flyout-content-label'>{t('transcript')}:</span>
                        { interview.alpha3s_with_transcript.map((lang) => {
                            return (
                                <InterviewDownloads
                                    key={lang}
                                    lang={lang}
                                    type='transcript'
                                    condition={showTranscriptPDF}
                                    showEmpty={true}
                                />
                            )
                        })}
                        <StatusForm
                            data={interview}
                            scope='interview'
                            attribute='public_attributes[transcript]'
                            value={interview.properties?.public_attributes?.transcript?.toString() === 'true'}
                        />
                    </p>
                </AuthShowContainer>
            )}
        </>
    );
}

InterviewTextMaterials.propTypes = {
    isCatalog: PropTypes.bool,
    interview: PropTypes.object.isRequired,
};
