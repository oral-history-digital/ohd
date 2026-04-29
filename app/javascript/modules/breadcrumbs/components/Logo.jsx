/* global railsMode */
import classNames from 'classnames';
import { OHD_DOMAINS } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function Logo({ logoSrc, title, variant = 'default' }) {
    const { locale } = useI18n();

    const src =
        logoSrc ||
        (variant === 'outline'
            ? '/logo-ohd-no-text-outline.svg'
            : '/logo-ohd-no-text.svg');
    const displayTitle = title || 'Oral-History.Digital (oh.d)';
    const altText = `${displayTitle} logo`;
    const ohdDomain = OHD_DOMAINS[railsMode];
    const localPath = `/${locale}`;
    const targetUrl = `${ohdDomain}${localPath}`;
    const isOnOhdDomain =
        typeof window !== 'undefined' && window.location.origin === ohdDomain;

    if (isOnOhdDomain) {
        return (
            <Link
                to={localPath}
                title={displayTitle}
                className="Breadcrumbs-logoLink"
            >
                <img
                    className={classNames('Breadcrumbs-logo', {
                        'Breadcrumbs-logo--outline': variant === 'outline',
                    })}
                    src={src}
                    alt={altText}
                />
            </Link>
        );
    }

    return (
        <a
            href={targetUrl}
            title={displayTitle}
            className="Breadcrumbs-logoLink"
        >
            <img
                className={classNames('Breadcrumbs-logo', {
                    'Breadcrumbs-logo--outline': variant === 'outline',
                })}
                src={src}
                alt={altText}
            />
        </a>
    );
}

Logo.propTypes = {
    logoSrc: PropTypes.string,
    title: PropTypes.string,
    variant: PropTypes.oneOf(['default', 'outline']),
};

export default Logo;
