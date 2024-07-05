import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { AuthShowContainer, AuthorizedContent, useAuthorization } from 'modules/auth';
import { SingleValueWithFormContainer, StatusForm } from 'modules/forms';
import InterviewDownloads from './InterviewDownloads';

export default function InterviewTextMaterials({
    interview,
    isCatalog,
}) {
    const { t, locale } = useI18n();
    const { isAuthorized } = useAuthorization();
    const showObservations = isAuthorized(interview, 'update') || (
        interview.properties?.public_attributes?.observations?.toString() === 'true' &&
        interview.observations?.[locale]
    );
    const showTranscriptPDF = interview.segments?.[1]?.[interview.first_segments_ids[1]] && (
        interview.properties?.public_attributes?.transcript?.toString() === 'true' ||
        isAuthorized(interview, 'update') 
    );

    if (!interview.language_id) {
        return null;
    }

    return (
        <>
            {showObservations && (
                <AuthShowContainer ifLoggedIn>
                    <p>
                        <span className='flyout-content-label'>{t('activerecord.attributes.interview.observations')}:</span>
                        { interview.translations && Object.values(interview.translations).map( ({ locale }) => {
                            return (
                                <InterviewDownloads
                                    key={locale}
                                    lang={locale}
                                    type='observations'
                                    condition={showObservations}
                                    showEmpty={true}
                                />
                            )
                        })}
                    </p>
                </AuthShowContainer>
            )}
            <SingleValueWithFormContainer
                obj={interview}
                collapse
                elementType="textarea"
                multiLocale
                attribute="observations"
                value={interview.observations?.[locale]?.substring(0,500)}
                noLabel
            />
            {!isCatalog && showTranscriptPDF && (
                <AuthShowContainer ifLoggedIn>
                    <p>
                        <span className='flyout-content-label'>{t('transcript')}:</span>
                        { interview.languages.map((lang) => {
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
