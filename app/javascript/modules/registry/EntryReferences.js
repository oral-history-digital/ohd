import { setArchiveId } from 'modules/archive';
import { useProjectDetail } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import SegmentReference from './SegmentReference';

/**
 * Lists registry references in their supplied interview order.
 *
 * @param {Object} props - Reference list properties.
 * @param {Object[]} props.references - Interviews and their segment references.
 * @param {Function} [props.onSubmit] - Called after selecting a segment.
 * @returns {React.ReactElement} Interview references with signed-in segment links.
 */
export default function EntryReferences({ references, onSubmit }) {
    const isLoggedIn = useSelector(getIsLoggedIn);

    return (
        <ul className="UnorderedList">
            {references.map((reference) => (
                <EntryReference
                    key={reference.archive_id}
                    reference={reference}
                    isLoggedIn={isLoggedIn}
                    onSubmit={onSubmit}
                />
            ))}
        </ul>
    );
}

/**
 * Loads one interview's project for its interview and segment links.
 *
 * @param {Object} props - Reference properties.
 * @param {Object} props.reference - Interview reference with its project ID and segments.
 * @param {boolean} props.isLoggedIn - Whether segment references are shown.
 * @param {Function} [props.onSubmit] - Called after selecting a segment.
 * @returns {React.ReactElement} Reference row, with plain text while the project is unavailable.
 */
function EntryReference({ reference, isLoggedIn, onSubmit }) {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const { archive_id, project_id, display_name, segment_references } =
        reference;
    const { project } = useProjectDetail(project_id);

    return (
        <li>
            <LinkOrA
                project={project}
                to={`interviews/${archive_id}`}
                onLinkClick={() => dispatch(setArchiveId(archive_id))}
                className="search-result-link"
            >
                {`${t('activerecord.models.registry_reference.one')} ${t('in')} ${display_name} (${archive_id})`}
            </LinkOrA>

            {isLoggedIn && (
                <ul className="HorizontalList">
                    {[...segment_references]
                        .sort(
                            (a, b) => a.tape_nbr - b.tape_nbr || a.time - b.time
                        )
                        .map((segmentRef) => (
                            <li
                                key={segmentRef.id}
                                className="HorizontalList-item"
                            >
                                <SegmentReference
                                    project={project}
                                    segmentRef={segmentRef}
                                    onSubmit={onSubmit}
                                />
                            </li>
                        ))}
                </ul>
            )}
        </li>
    );
}

EntryReferences.propTypes = {
    references: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
};

EntryReference.propTypes = {
    reference: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func,
};
