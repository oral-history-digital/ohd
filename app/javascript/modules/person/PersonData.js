import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

import {
    AuthorizedContent,
    AuthShowContainer,
    useProjectAccessStatus
} from 'modules/auth';
import { useIsEditor } from 'modules/archive';
import { ContentField } from 'modules/forms';
import { Modal } from 'modules/ui';
import { Spinner } from 'modules/spinners';
import { humanReadable } from 'modules/data';
import { useI18n } from 'modules/i18n';
import usePersonWithAssociations from './usePersonWithAssociations';
import Biography from './Biography';
import PersonForm from './PersonForm';

export default function PersonData({
    interview,
    intervieweeId,
    project,
}) {
    const { t, locale, translations } = useI18n();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const isEditor = useIsEditor();

    const { data: person, isLoading, isValidating } = usePersonWithAssociations(intervieweeId);

    const metadataFields = Object.values(project.metadata_fields)
        .filter(field =>
            field.source === 'Person' &&
                (
                    (projectAccessGranted && field.use_in_details_view) ||
                    (!projectAccessGranted && field.display_on_landing_page)
                )
    );

    if (intervieweeId === null) {
        return (
            <div>
                {t('modules.person.no_interviewee')}
            </div>
        );
    }

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            <AuthShowContainer ifLoggedIn>
                <ContentField
                    label={t('interviewee_name')}
                    value={person.display_name}
                    fetching={isValidating}
                >
                    <AuthorizedContent object={person} action='update'>
                        <Modal
                            hideHeading
                            title={t('edit.contribution.edit')}
                            trigger={(<>
                                <FaPencilAlt className="Icon Icon--editorial Icon--small" />
                                {' '}
                                {t('edit.contribution.edit')}
                            </>)}
                        >
                            {close => (
                                <PersonForm
                                    data={person}
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

            {person && metadataFields.map(field => {
                const label = field.label?.[locale] || t(field.name);
                const value = humanReadable(person, field.name, { locale, translations }, {});

                if (value === '---' && !isEditor) {
                    return null;
                }

                return (
                    <ContentField
                        key={field.name}
                        label={label}
                        value={value}
                        linkUrls={field.name === 'description'}
                    />
                );
            })}

            {!project.is_catalog && person && <Biography />}
        </>
    );
}

PersonData.propTypes = {
    interview: PropTypes.object.isRequired,
    intervieweeId: PropTypes.number,
    project: PropTypes.object.isRequired,
};
