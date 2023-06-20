import PropTypes from 'prop-types';
import { FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { OHD_DOMAINS } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function CollectionLink({
    collectionId,
    notes,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();

    const linkLocale = locale === 'de' ? 'de' : 'en';
    const linkPath = `/${linkLocale}/catalog/collections/${collectionId}`;
    const hasOwnDomain = typeof project.archive_domain === 'string'
        && project.archive_domain !== ''
        && !project.is_ohd;

    const ohdDomain = OHD_DOMAINS[railsMode];

    return (
        <span>
            <FaInfoCircle
                className="Icon Icon--unobtrusive u-mr-tiny"
                title={notes}
            />
            {hasOwnDomain ? (
                <a
                    href={`${ohdDomain}${linkPath}`}
                    title={t('modules.interview_metadata.collection_link_title')}
                    target="_blank"
                    rel="noreferrer"
                >
                    <FaExternalLinkAlt className="Icon Icon--unobtrusive u-mr-tiny" />
                </a>
            ) : (
                <Link
                    to={linkPath}
                    title={t('modules.interview_metadata.collection_link_title')}
                >
                    <FaExternalLinkAlt className="Icon Icon--unobtrusive u-mr-tiny" />
                </Link>
            )}
        </span>
    );
}

CollectionLink.propTypes = {
    collectionId: PropTypes.number.isRequired,
    notes: PropTypes.string,
};
