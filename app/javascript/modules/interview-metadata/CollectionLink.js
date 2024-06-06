import PropTypes from 'prop-types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { OHD_DOMAINS } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function CollectionLink({
    collectionId,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();

    const linkLocale = locale === 'de' ? 'de' : 'en';
    const linkPath = `/${linkLocale}/catalog/collections/${collectionId}`;
    const hasOwnDomain = typeof project.archive_domain === 'string'
        && project.archive_domain !== ''
        && !project.is_ohd;

    const ohdDomain = OHD_DOMAINS[railsMode];

    return hasOwnDomain ? (
        <a
            href={`${ohdDomain}${linkPath}`}
            title={t('modules.interview_metadata.collection_link_title')}
            target="_blank"
            rel="noreferrer"
            className="u-ml-tiny"
        >
            <FaExternalLinkAlt className="Icon Icon--unobtrusive Facet-collectionIcon" />
        </a>
    ) : (
        <Link
            to={linkPath}
            title={t('modules.interview_metadata.collection_link_title')}
            className="u-ml-tiny"
        >
            <FaExternalLinkAlt className="Icon Icon--unobtrusive Facet-collectionIcon" />
        </Link>
    );
}

CollectionLink.propTypes = {
    collectionId: PropTypes.number.isRequired,
};
