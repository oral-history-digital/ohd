import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { humanReadable, getLanguages, getProjects } from 'modules/data';
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
    const projects = useSelector(getProjects);
    const languages = useSelector(getLanguages);
    const { locale, translations } = useI18n();
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
                        const value = humanReadable(obj, field.name, {
                            locale,
                            translations,
                            languages,
                            optionsScope: 'search_facets',
                            collections: project.collections,
                            projects,
                        }, {}, '');

                        if (!value) {
                            return null;
                        }

                        return (
                            <li
                                key={field.name}
                                className={classNames('DetailList-item', {
                                    'DetailList-item--shortened': field.name === 'description',
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
    interviewee: PropTypes.object,
    projects: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    peopleStatus: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
};
