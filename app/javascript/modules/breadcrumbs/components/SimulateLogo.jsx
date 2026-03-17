import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Renders an archive name as a visually prominent logo substitute.
 * Used when an archive has no logo image (Mode C).
 * Purely presentational — all data is received via props.
 */
export function SimulateLogo({ archiveName, to }) {
    const text = <span className="SimulateLogo-text">{archiveName}</span>;

    if (to) {
        return (
            <Link to={to} className="SimulateLogo Breadcrumbs-logoLink">
                {text}
            </Link>
        );
    }

    return <span className="SimulateLogo">{text}</span>;
}

SimulateLogo.propTypes = {
    archiveName: PropTypes.string.isRequired,
    to: PropTypes.string,
};

export default SimulateLogo;
