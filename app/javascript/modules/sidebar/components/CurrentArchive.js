import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Links the localized project name to its homepage.
 *
 * @param {Object} props - Link properties.
 * @param {string} [props.className] - Additional wrapper classes.
 * @returns {React.ReactElement|null} Project link or error; empty while loading.
 */
export default function CurrentArchive({ className }) {
    const { project, isLoading, error } = useProject();
    const { t } = useI18n();
    const pathBase = usePathBase();

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
    if (isLoading || !project) return null;

    const name = project.display_name || project.name || project.shortname;

    return (
        <p className={className}>
            <Link to={pathBase} className="Link" title={t('home')}>
                <b>{name}</b>
            </Link>
        </p>
    );
}

CurrentArchive.propTypes = {
    className: PropTypes.string,
};
