import PropTypes from 'prop-types';

import { useProject, usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function CurrentArchive({
    className,
}) {
    const { project } = useProject();
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const name = project.display_name[locale] || project.name[locale];

    return (
        <p className={className}>
            <a href={pathBase} className="Link" title={t('home')}>
                <b>{name}</b>
            </a>
        </p>
    );
}

CurrentArchive.propTypes = {
    className: PropTypes.string,
};
