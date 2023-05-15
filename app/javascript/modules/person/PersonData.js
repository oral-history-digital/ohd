import PropTypes from 'prop-types';

import { useProjectAccessStatus } from 'modules/auth';
import { useIsEditor } from 'modules/archive';
import { ContentField } from 'modules/forms';
import { Spinner } from 'modules/spinners';
import { humanReadable } from 'modules/data';
import { EventContentField } from 'modules/events';
import { useI18n } from 'modules/i18n';
import usePersonWithAssociations from './usePersonWithAssociations';
import Biography from './Biography';
import NameOrPseudonym from './NameOrPseudonym';
import getDisplayedMetadataFields from './getDisplayedMetadataFields';

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

    if (isLoading) {
        return <Spinner />;
    }

    if (intervieweeId === null || !person) {
        return (
            <div>
                {t('modules.person.no_interviewee')}
            </div>
        );
    }

    return (
        <>
            <NameOrPseudonym
                type="name"
                person={person}
                interview={interview}
                fetching={isValidating}
            />
            {displayedMetadataFields.map(field => {
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

                if (field.name === 'pseudonym_or_name') {
                    return (<NameOrPseudonym
                        type="pseudonym"
                        person={person}
                        interview={interview}
                        fetching={isValidating}
                    />);
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
