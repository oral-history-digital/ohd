import { getCollections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaLock } from 'react-icons/fa';
import { useSelector } from 'react-redux';

/**
 * Marks an interview's unpublished collection using already loaded collection data.
 * @param {Object} props - Collection reference.
 * @param {Object} props.interview - Interview with collection_id and project_id.
 * @returns {?React.ReactElement} Icon badge, or nothing for public, missing, or unrelated collections.
 */
export default function CollectionPublicationStatus({ interview }) {
    const collections = useSelector(getCollections);
    const collection = collections?.[interview.collection_id];
    const { t } = useI18n();
    if (
        collection?.workflow_state !== 'unshared' ||
        collection.project_id !== interview.project_id
    )
        return null;

    const label = `${t('activerecord.models.collection.one')} ${t('workflow_state.unshared')}`;
    return (
        <span
            className="CollectionPublicationStatus"
            role="img"
            aria-label={label}
            title={label}
        >
            <FaLock aria-hidden="true" />
        </span>
    );
}

CollectionPublicationStatus.propTypes = {
    interview: PropTypes.object.isRequired,
};
