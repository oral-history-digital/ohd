import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

import { ContentField } from 'modules/forms';
import Biography from './Biography';
import { ContributionFormContainer } from 'modules/interview-metadata';
import { Modal } from 'modules/ui';
import { Spinner } from 'modules/spinners';
import { AuthorizedContent, AuthShowContainer } from 'modules/auth';
import { humanReadable } from 'modules/data';
import { fullName } from 'modules/people';
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
    const { projectAccessGranted } = useProjectAccessStatus(project);

    useEffect(() => {
        if (!projectAccessGranted) {
            fetchData({ projectId, locale, projects }, 'people', interview.interviewee_id, 'landing_page_metadata');
        } else if (projectAccessGranted && !interviewee?.associations_loaded) {
            fetchData({ projectId, locale, projects }, 'people', interview.interviewee_id, null, 'with_associations=true');
        }
    }, [projectAccessGranted, isLoggedIn, interviewee?.associations_loaded]);

    const metadataFields = Object.values(project.metadata_fields).filter(
        field => field.source === 'Person' && ((projectAccessGranted && field.use_in_details_view) || (!projectAccessGranted && field.display_on_landing_page))
    )

    if (!interviewee) {
        return <Spinner />;
    }

    return (
        <>
            <AuthShowContainer ifLoggedIn>
                <ContentField label={t('interviewee_name')} value={fullName(interviewee, locale, true)} >
                    <AuthorizedContent object={interviewee} action='update'>
                        <Modal
                            title={t('edit.contribution.edit')}
                            trigger={<><FaPencilAlt className="Icon Icon--editorial Icon--small" /> {t('edit.contribution.edit')}</>}
                        >
                            {close => (
                                <ContributionFormContainer
                                    data={interview.contributions && Object.values(interview.contributions).filter(c => c.contribution_type === 'interviewee')[0]}
                                    interview={interview}
                                    withSpeakerDesignation
                                    submitData={submitData}
                                    onSubmit={close}
                                    onCancel={close}
                                />
                            )}
                        </Modal>
                    </AuthorizedContent>
                </ContentField>
            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut ifNoProject>
                <ContentField
                    label={t('interviewee_name')}
                    value={interview?.anonymous_title?.[locale]}
                />
            </AuthShowContainer>

            {
                interviewee && metadataFields.map(field => {
                    const label = field.label?.[locale] || t(field.name);
                    const value = humanReadable(interviewee, field.name, { locale, translations }, {});

                    return (
                        <ContentField
                            key={field.name}
                            label={label}
                            value={value}
                        />
                    );
                })
            }

            { !project.is_catalog && interviewee?.associations_loaded && <Biography /> }
        </>
    );
}

PersonData.propTypes = {
    archiveId: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
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
