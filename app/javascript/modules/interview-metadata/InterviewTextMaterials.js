import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { AuthShowContainer, AuthorizedContent, useAuthorization } from 'modules/auth';
import { SingleValueWithFormContainer } from 'modules/forms';
import InterviewDownloads from './InterviewDownloads';

export default function InterviewTextMaterials({
    interview,
    project,
    locale,
}) {

    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();
    const showObservations = isAuthorized(interview, 'update') || interview.properties?.public_attributes?.observations?.toString() === 'true';
    debugger

    if (!interview.language_id) {
        return null;
    }

    return (
        <>
            <AuthorizedContent object={interview} action="show">
                {
                    <SingleValueWithFormContainer
                        obj={interview}
                        collapse
                        elementType="textarea"
                        multiLocale
                        attribute={'observations'}
                    />
                }
            </AuthorizedContent>
            <AuthShowContainer ifLoggedIn>
                <p>
                    <span className='flyout-content-label'>{t('activerecord.attributes.interview.observations')}:</span>
                    <InterviewDownloads
                        lang={interview.lang}
                        type='observations'
                        condition={showObservations && interview.observations?.[interview.lang]}
                        showEmpty={true}
                    />
                    <InterviewDownloads
                        lang={locale}
                        type='observations'
                        condition={showObservations && interview.observations?.[locale] && interview.lang !== locale}
                    />
                </p>
                <p>
                    <span className='flyout-content-label'>{t('transcript')}:</span>
                    <InterviewDownloads
                        lang={interview.lang}
                        type='transcript'
                        condition={interview.segments?.[1]?.[interview.first_segments_ids[1]]}
                        showEmpty={true}
                    />
                    <InterviewDownloads
                        lang={locale}
                        type='transcript'
                        condition={
                            (interview.languages.indexOf(locale) > -1 && interview.lang !== locale) &&
                            (interview.segments?.[1]?.[interview.first_segments_ids[1]])
                        }
                        showEmpty={true}
                    />
                </p>
            </AuthShowContainer>
        </>
    );
}

InterviewTextMaterials.propTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};
