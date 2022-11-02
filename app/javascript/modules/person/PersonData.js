import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

import { ContentField } from 'modules/forms';
import Biography from './Biography';
import { Modal } from 'modules/ui';
import { Spinner } from 'modules/spinners';
import { AuthorizedContent, AuthShowContainer } from 'modules/auth';
import { humanReadable } from 'modules/data';
import { formatPersonName } from 'modules/person';
import { useI18n } from 'modules/i18n';
import { useProjectAccessStatus } from 'modules/auth';
import usePersonWithAssociations from './usePersonWithAssociations';
import PersonForm from './PersonForm';

export default function PersonData({
    interview,
    intervieweeId,
    project,
}) {
    const { t, locale, translations } = useI18n();
    const { projectAccessGranted } = useProjectAccessStatus(project);

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

    const personName = formatPersonName(person, translations,
        { locale, withBirthName: true, withTitle: true });

    return (
        <>
            <AuthShowContainer ifLoggedIn>
                <ContentField
                    label={t('interviewee_name')}
                    value={personName}
                    fetching={isValidating}
                >
                    <AuthorizedContent object={person} action='update'>
                        <Modal
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
