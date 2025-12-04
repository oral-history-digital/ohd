import { OHD_DOMAINS } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function CatalogLink({ id, type }) {
    const { t, locale } = useI18n();
    const { project } = useProject();

    const linkLocale = locale === 'de' ? 'de' : 'en';
    const linkPath = `/${linkLocale}/catalog/${type}s/${id}`;
    const hasOwnDomain =
        typeof project.archive_domain === 'string' &&
        project.archive_domain !== '' &&
        !project.is_ohd;

    const ohdDomain = OHD_DOMAINS[railsMode];
    const title = t(`modules.interview_metadata.${type}_link_title`);
    const className = 'u-ml-tiny';
    const icon = (
        <FaExternalLinkAlt className="Icon Icon--unobtrusive Facet-collectionIcon" />
    );

    return hasOwnDomain ? (
        <a
            href={`${ohdDomain}${linkPath}`}
            title={title}
            target="_blank"
            rel="noreferrer"
            className={className}
        >
            {icon}
        </a>
    ) : (
        <Link to={linkPath} title={title} className={className}>
            {icon}
        </Link>
    );
}

CatalogLink.propTypes = {
    collectionId: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['archive', 'collection']),
};
