import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { humanReadable } from 'modules/data';
import loadIntervieweeWithAssociations from './loadIntervieweeWithAssociations';
import { useProjectAccessStatus } from 'modules/auth';

export default function ThumbnailMetadata({
    interview,
    project,
    projects,
    locale,
    translations,
    languages,
    isLoggedIn,
    peopleStatus,
    fetchData,
}) {
    const intervieweeId = interview.interviewee_id;
    const interviewee = project.people[intervieweeId];
    const projectId = project.identifier;
    const { projectAccessGranted } = useProjectAccessStatus();

    useEffect(() => {
        if (projectAccessGranted) {
            loadIntervieweeWithAssociations({ interviewee, intervieweeId, peopleStatus, fetchData, locale, projectId, projects });
        }
    }, [isLoggedIn]);

    return (
        <ul className="DetailList" lang={locale}>
            {
                project.grid_fields.map((field) => {
                    const obj = (field.ref_object_type === 'Interview' || field.source === 'Interview') ?
                        interview :
                        interviewee;

                    if (obj) {
                        return (
                            <li
                                key={field.name}
                                className={classNames('DetailList-item', {
                                    'DetailList-item--shortened': field.name === 'description',
                                })}
                            >
                                {humanReadable(obj, field.name, { locale, translations, languages, optionsScope: 'search_facets' }, {}, '')}
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
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    peopleStatus: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
};
