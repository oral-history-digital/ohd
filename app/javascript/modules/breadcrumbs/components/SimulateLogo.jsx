import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getArchiveLabel } from '../utils';

/**
 * Renders an archive name as a visually prominent logo substitute.
 * Used when an archive has no logo image (Mode C).
 * Purely presentational — all data is received via props.
 */
export function SimulateLogo({ project }) {
    const { locale } = useI18n();
    const pathBase = usePathBase();

    if (!project) return null;

    const name = getArchiveLabel(project, locale) ?? project.shortname;
    const text = <span className="SimulateLogo-text">{name}</span>;

    if (pathBase) {
        return (
            <Link to={pathBase} className="SimulateLogo Breadcrumbs-logoLink">
                {text}
            </Link>
        );
    }

    return <span className="SimulateLogo">{text}</span>;
}

SimulateLogo.propTypes = {
    project: PropTypes.object.isRequired,
};

export default SimulateLogo;
