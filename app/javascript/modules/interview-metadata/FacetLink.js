import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function FacetLink({ id, type }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const linkPath = `${pathBase}/catalog/${type}s/${id}`;

    return (
        <Link
            to={linkPath}
            title={t('modules.interview_metadata.archive_link_title')}
            className="u-ml-tiny"
        >
            <FaExternalLinkAlt className="Icon Icon--unobtrusive Facet-collectionIcon" />
        </Link>
    );
}

FacetLink.propTypes = {
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['archive', 'collection']),
};
