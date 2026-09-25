import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt } from 'react-icons/fa';

export default function NewTabLink({
    children,
    className,
    href,
    showIcon = false,
    ...props
}) {
    const { t } = useI18n();

    return (
        <a
            {...props}
            className={className}
            href={href}
            target="_blank"
            rel="noreferrer"
        >
            {children}
            {showIcon && (
                <FaExternalLinkAlt
                    aria-hidden
                    className="Icon Icon--small u-ml-tiny"
                />
            )}
            <span className="u-visuallyHidden">
                {' '}
                ({t('modules.ui.new_tab_link.opens_in_new_tab')})
            </span>
        </a>
    );
}

NewTabLink.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
    showIcon: PropTypes.bool,
};
