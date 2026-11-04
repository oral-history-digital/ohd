import { useIsEditor } from 'modules/archive';
import { useProjectAccessStatus } from 'modules/auth';
import { useHumanReadable } from 'modules/data';
import { EventContentField } from 'modules/events';
import { ContentField } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import Biography from './Biography';
import NameOrPseudonym from './NameOrPseudonym';
import getDisplayedMetadataFields from './getDisplayedMetadataFields';
import { usePersonWithAssociations } from './hooks';

/**
 * Displays person metadata allowed by the current project's field and access settings.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.interview - Interview used for name and pseudonym display.
 * @param {number|null} [props.intervieweeId] - Person to load.
 * @returns {React.ReactElement} Person metadata or its loading/error state.
 */
export default function PersonData({ interview, intervieweeId }) {
    const { t } = useI18n();
    const { humanReadable } = useHumanReadable();
    const {
        project,
        isLoading: projectIsLoading,
        error: projectError,
    } = useProject({
        include: ['metadata_fields'],
    });
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const isEditor = useIsEditor();

    const {
        data: person,
        isLoading,
        isValidating,
        error: personError,
    } = usePersonWithAssociations(intervieweeId);

    const displayedMetadataFields = getDisplayedMetadataFields(
        project?.metadata_fields || [],
        projectAccessGranted
    );

    const error = projectError || personError;
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
    if (projectIsLoading || isLoading) {
        return <Spinner />;
    }

    if (intervieweeId === null || !person) {
        return <div>{t('modules.person.no_interviewee')}</div>;
    }

    return (
        <>
            <NameOrPseudonym
                type="name"
                person={person}
                interview={interview}
                fetching={isValidating}
            />
            {displayedMetadataFields.map((field, index) => {
                if (field.source === 'EventType') {
                    const events = person.events?.filter(
                        (event) => event.event_type_id === field.event_type_id
                    );

                    if (!events || events.length === 0) {
                        return null;
                    }

                    return (
                        <EventContentField
                            key={index}
                            label={field.label}
                            events={events}
                        />
                    );
                }

                if (field.name === 'pseudonym_or_name') {
                    return (
                        <NameOrPseudonym
                            key={index}
                            type="pseudonym"
                            person={person}
                            interview={interview}
                            fetching={isValidating}
                        />
                    );
                }

                const label = field.label || t(field.name);
                const value = humanReadable({
                    obj: person,
                    attribute: field.name,
                });

                if ((value === null || value === '---') && !isEditor) {
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

            {person && <Biography />}
        </>
    );
}

PersonData.propTypes = {
    interview: PropTypes.object.isRequired,
    intervieweeId: PropTypes.number,
};
