import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { humanReadable, getLanguages } from 'modules/data';
import { usePersonWithAssociations } from 'modules/person';
import { Spinner } from 'modules/spinners';
import { EventAlt } from 'modules/events';
import { useI18n } from 'modules/i18n';

export default function ThumbnailMetadata({
    interview,
    project,
}) {
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
                    const obj = (field.ref_object_type === 'Interview' || field.source === 'Interview') ?
                        interview :
                        interviewee;

                    if (field.source === 'EventType') {
                        const event = interviewee?.events?.find(e =>
                            e.event_type_id === field.event_type_id);

                        if (!event) {
                            return null;
                        }

                        return (
                            <EventAlt
                                event={event}
                                withLabel={false}
                                className={classNames('DetailList-item', {
                                    'DetailList-item--shortened': field.name === 'description',
                                })}
                            />
                        );
                    }

                    if (obj) {
                        return (
                            <li
                                key={field.name}
                                className={classNames('DetailList-item', {
                                    'DetailList-item--shortened': field.name === 'description',
                                })}
                            >
                                {humanReadable(obj, field.name, {
                                    locale,
                                    translations,
                                    languages,
                                    optionsScope: 'search_facets',
                                    collections: project.collections,
                                }, {}, '')}
                                {' '}
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
    project: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    peopleStatus: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
};
