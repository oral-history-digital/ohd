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
import { formatPersonName } from 'modules/person';
import { EventContentField } from 'modules/events';
import { useI18n } from 'modules/i18n';
import {
    METADATA_SOURCE_EVENT_TYPE,
    METADATA_SOURCE_PERSON
} from 'modules/constants';
import usePersonWithAssociations from './usePersonWithAssociations';
import Biography from './Biography';
import PersonForm from './PersonForm';

function getDisplayedMetadataFields(metadataFields, isProjectAccessGranted) {
    const filteredFields = metadataFields.filter(field => {
        const isPersonType = field.source === METADATA_SOURCE_PERSON ||
            field.source === METADATA_SOURCE_EVENT_TYPE && field.eventable_type === 'Person';

        const isAllowed = isProjectAccessGranted && field.use_in_details_view ||
            !isProjectAccessGranted && field.display_on_landing_page;

        return isPersonType && isAllowed;
    });

    return filteredFields;
}

export default function PersonData({
    interview,
    intervieweeId,
    project,
}) {
    const { t, locale, translations } = useI18n();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const isEditor = useIsEditor();

    const { data: person, isLoading, isValidating } = usePersonWithAssociations(intervieweeId);

    const displayedMetadataFields = getDisplayedMetadataFields(
        Object.values(project.metadata_fields), projectAccessGranted);

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

    const personName = formatPersonName(person, translations, {
        locale,
        fallbackLocale: project.default_locale,
        withTitle: true,
    });

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

            {person && displayedMetadataFields.map(field => {
                if (field.source === 'EventType') {
                    const events = person.events.filter(event =>
                        event.event_type_id === field.event_type_id);

                    if (events.length === 0) {
                        return null;
                    }

                    return (
                        <EventContentField
                            label={field.label?.[locale]}
                            events={events}
                        />
                    );
                }

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
