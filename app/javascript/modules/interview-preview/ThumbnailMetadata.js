import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { useHumanReadable, getCurrentUser } from 'modules/data';
import { useAuthorization } from 'modules/auth';
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
    const currentUser = useSelector(getCurrentUser);
    const permitted = currentUser?.interview_permissions.some(p => p.interview_id === interview.id);
    const isRestricted = interview.workflow_state === 'restricted';
    const { isAuthorized } = useAuthorization();

    if (isLoading || !project.grid_fields) {
        return <Spinner />;
    }

    return (
        <ul className="DetailList" lang={locale}>
            {
                project.grid_fields.map((field) => {
                    const allowedToSee = !isRestricted ||
                        (isRestricted && field.display_on_landing_page) ||
                        (isRestricted && permitted) ||
                        isAuthorized(interview, 'update');

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
                                {allowedToSee && formattedEvents}
                            </li>
                        );
                    }

                    if (obj) {
                        const value = humanReadable({
                            locale: locale,
                            obj,
                            attribute: field.name,
                            optionsScope: 'search_facets',
                            none: null,
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
                                {allowedToSee && value}
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
