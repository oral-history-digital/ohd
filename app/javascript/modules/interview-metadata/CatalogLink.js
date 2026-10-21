/* global railsMode */
import { OHD_DOMAINS } from 'modules/constants';
import { useUmbrellaProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * Links an entity to the portal catalog, opening it externally on project domains.
 *
 * @param {Object} props - Catalog target.
 * @param {number} props.id - Target project or collection ID.
 * @param {'archive'|'collection'} props.type - Existing catalog route category.
 * @returns {React.ReactElement|null} Catalog link or error; empty while loading.
 */
export default function CatalogLink({ id, type }) {
    const { t, locale } = useI18n();
    const { project, isLoading, error: projectError } = useProject({});
    const {
        project: umbrellaProject,
        isLoading: umbrellaIsLoading,
        error: umbrellaError,
    } = useUmbrellaProject();
    const error = projectError || umbrellaError;

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project || umbrellaIsLoading || !umbrellaProject)
        return null;

    const linkLocale = locale === 'de' ? 'de' : 'en';
    const linkPath = `/${linkLocale}/catalog/${type}s/${id}`;
    const hasOwnDomain =
        typeof project.archive_domain === 'string' &&
        project.archive_domain !== '' &&
        !project.is_umbrella;

    const ohdDomain = OHD_DOMAINS[railsMode];
    const translatedTitle = t(`modules.interview_metadata.${type}_link_title`, {
        umbrella_project_name:
            umbrellaProject?.display_shortname || umbrellaProject?.shortname,
    });
    const title = Array.isArray(translatedTitle)
        ? translatedTitle.join('')
        : translatedTitle;
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
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['archive', 'collection']),
};
