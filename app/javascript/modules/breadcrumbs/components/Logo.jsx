import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function Logo({ logoSrc, title }) {
    const { locale } = useI18n();

    const src = logoSrc || '/logo-ohd-no-text.svg';
    const displayTitle = title || 'Oral-History.Digital (oh.d)';
    const altText = `${displayTitle} logo`;

    return (
        <Link
            to={`/${locale}`}
            title={displayTitle}
            className="Breadcrumbs-logoLink"
        >
            <img className={'Breadcrumbs-logo'} src={src} alt={altText} />
        </Link>
    );
}

Logo.propTypes = {
    logoSrc: PropTypes.string,
    title: PropTypes.string,
};

export default Logo;
