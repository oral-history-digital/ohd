import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { useHumanReadable } from 'modules/data';
import { usePersonWithAssociations } from 'modules/person';
import { Spinner } from 'modules/spinners';
import { formatEventShort } from 'modules/events';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import {
    METADATA_SOURCE_EVENT_TYPE,
    METADATA_SOURCE_INTERVIEW
} from '../constants';

export default function ThumbnailMetadata({
    interview,
}) {
    const { project } = useProject();
    const { locale } = useI18n();
    const { humanReadable } = useHumanReadable();
    const { data: interviewee, isLoading } = usePersonWithAssociations(interview.interviewee_id);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <ul className="DetailList" lang={locale}>
            {
                project.grid_fields.map((field) => {
                    const obj = (field.ref_object_type === 'Interview' || field.source === METADATA_SOURCE_INTERVIEW) ?
                        interview :
                        interviewee;

                    if (field.source === METADATA_SOURCE_EVENT_TYPE) {
                        const events = interviewee?.events?.filter(e =>
                            e.event_type_id === field.event_type_id);

                        const formattedEvents = events
                            ?.map(e => formatEventShort(e, locale))
                            ?.join(', ');

                        return (
                            <li
                                key={field.name}
                                className="DetailList-item"
                            >
                                {formattedEvents}
                            </li>
                        );
                    }

                    if (obj) {
                        const value = humanReadable({
                            obj,
                            attribute: field.name,
                            optionsScope: 'search_facets',
                        });

                        if (!value) {
                            return null;
                        }

                        return (
                            <li
                                key={field.name}
                                className={classNames('DetailList-item', {
                                    'DetailList-item--shortened': field.name === 'description',
                                    'DetailList-item--one-line': field.name === 'collection_id',
                                })}
                            >
                                {value}
                            </li>
                        );
                    } else {
                        return null;
                    }
                })
            }
        </ul>
    );
}

ThumbnailMetadata.propTypes = {
    interview: PropTypes.object.isRequired,
};
