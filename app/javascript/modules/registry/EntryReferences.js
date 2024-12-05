import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { setArchiveId } from 'modules/archive';
import { getProjects } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import SegmentReference from './SegmentReference';

export default function EntryReferences({
    references,
    onSubmit,
}) {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const projects = useSelector(getProjects);
    const isLoggedIn = useSelector(getIsLoggedIn);

    return (
        <ul className="UnorderedList">
            {references.map(({ archive_id, project_id, display_name, segment_references }) => (
                <li key={archive_id}>
                    <LinkOrA
                        project={projects[project_id]}
                        to={`interviews/${archive_id}`}
                        onLinkClick={() => dispatch(setArchiveId(archive_id))}
                        className="search-result-link"
                    >
                        {`${t('activerecord.models.registry_reference.one')} ${t('in')} ${display_name} (${archive_id})`}
                    </LinkOrA>

                    {isLoggedIn && (
                    <ul className="HorizontalList">
                        {segment_references.sort((a,b) => a.tape_nbr - b.tape_nbr || a.time - b.time)
                            .map((segmentRef) => (
                            <li key={segmentRef.id} className="HorizontalList-item">
                                <SegmentReference
                                    project={projects[project_id]}
                                    segmentRef={segmentRef}
                                    onSubmit={onSubmit}
                                />
                            </li>
                        ))}
                    </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}

EntryReferences.propTypes = {
    references: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
};
