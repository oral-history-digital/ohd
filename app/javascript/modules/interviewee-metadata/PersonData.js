import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

import { ContentField } from 'modules/forms';
import Biography from './Biography';
import { ContributionFormContainer } from 'modules/interview-metadata';
import { Modal } from 'modules/ui';
import { AuthorizedContent, AuthShowContainer } from 'modules/auth';
import { humanReadable } from 'modules/data';
import { fullname } from 'modules/people';
import { useI18n } from 'modules/i18n';
import { useProjectAccessStatus } from 'modules/auth';

export default function PersonData({
    interviewee,
    interview,
    project,
    projects,
    projectId,
    locale,
    translations,
    fetchData,
    submitData,
    isLoggedIn,
}) {

    const { t } = useI18n();
    const { projectAccessGranted } = useProjectAccessStatus();

    useEffect(() => {
        if (!projectAccessGranted) {
            fetchData({ projectId, locale, projects }, 'people', interview.interviewee_id, 'landing_page_metadata');
        } else if (projectAccessGranted && !interviewee?.associations_loaded) {
            fetchData({ projectId, locale, projects }, 'people', interview.interviewee_id, null, 'with_associations=true');
        }
    }, [projectAccessGranted, isLoggedIn, interviewee?.associations_loaded]);

    return (
        <>
            <AuthShowContainer ifLoggedIn={true}>
                <ContentField label={t('interviewee_name')} value={fullname({locale}, interviewee, true)} >
                    <AuthorizedContent object={interviewee} action='update'>
                        <Modal
                            title={t('edit.contribution.edit')}
                            trigger={<><FaPencilAlt className="Icon Icon--editorial Icon--small" /> {t('edit.contribution.edit')}</>}
                        >
                            {close => (
                                <ContributionFormContainer
                                    contribution={interview.contributions && Object.values(interview.contributions).filter(c => c.contribution_type === 'interviewee')[0]}
                                    interview={interview}
                                    withSpeakerDesignation
                                    submitData={submitData}
                                    onSubmit={close}
                                />
                            )}
                        </Modal>
                    </AuthorizedContent>
                </ContentField>
            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                <ContentField
                    label={t('interviewee_name')}
                    value={interview?.anonymous_title && interview?.anonymous_title[locale]}
                />
            </AuthShowContainer>

            <AuthorizedContent object={interviewee} action='show'>
                { interviewee && Object.values(project.metadata_fields).filter(m => {
                    return (m.source === 'Person' && (
                            (projectAccessGranted && m.use_in_details_view) ||
                            (!projectAccessGranted && m.display_on_landing_page)
                    ))
                }).map(function(metadataField, i) {
                    let label = metadataField.label && metadataField.label[locale] || t(metadataField.name);
                    let value = humanReadable(interviewee, metadataField.name, { locale, translations }, {});

                    return <ContentField label={label} value={value} key={`detail-${i}`} />
                })}
            </AuthorizedContent>

            { interviewee?.associations_loaded && <Biography /> }
        </>
    );
}

PersonData.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    interviewee: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
};
