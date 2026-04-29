import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function GenericLink({
    labelKey,
    url,
    isExternal = false,
    title,
    groupClassName,
    linkClassName,
}) {
    const { t } = useI18n();

    if (!url) return null;

    const text = title || url;
    const link = isExternal ? (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={linkClassName}
        >
            {text}
        </a>
    ) : (
        <Link to={url} className={linkClassName}>
            {text}
        </Link>
    );

    return (
        <div className={`DescriptionList-group ${groupClassName}`}>
            <dt className="DescriptionList-term">{t(labelKey)}</dt>
            <dd className="DescriptionList-description">{link}</dd>
        </div>
    );
}

GenericLink.propTypes = {
    labelKey: PropTypes.string.isRequired,
    url: PropTypes.string,
    isExternal: PropTypes.bool,
    title: PropTypes.string,
    groupClassName: PropTypes.string.isRequired,
    linkClassName: PropTypes.string,
};

export default GenericLink;
