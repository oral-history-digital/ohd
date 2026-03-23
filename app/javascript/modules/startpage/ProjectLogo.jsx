import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { SmartImage } from 'modules/ui';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import getProjectLogoSrc from './utils/getProjectLogoSrc';

export default function ProjectLogo({ project, isLinkActive = true }) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    if (!project) return null;

    let src = getProjectLogoSrc(project, locale);
    if (!src) return null; // No suitable logo found

    const image = (
        <SmartImage
            src={src}
            alt={t('Project logo')}
            className="ProjectLogo--logo"
            aspectRatio="auto"
            lazy={false}
        />
    );

    return (
        <div className="ProjectLogo">
            {isLinkActive ? (
                <Link
                    to={pathBase}
                    className={classNames('Link', 'ProjectLogo--link')}
                    title={t('Home')}
                >
                    {image}
                </Link>
            ) : (
                image
            )}
        </div>
    );
}

ProjectLogo.propTypes = {
    project: PropTypes.object.isRequired,
    isLinkActive: PropTypes.bool,
};
