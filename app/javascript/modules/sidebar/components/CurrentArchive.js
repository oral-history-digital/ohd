import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function CurrentArchive({ className }) {
    const { project } = useProject();
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const name = project.display_name[locale] || project.name[locale];

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
