import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export default function Extra({ html, tag, className, labelKey }) {
    const { t } = useI18n();
    const Tag = tag || 'div';

    if (html) return html;

    return <Tag className={className}>{labelKey && t(labelKey)}</Tag>;
}

Extra.propTypes = {
    html: PropTypes.node,
    tag: PropTypes.string,
    className: PropTypes.string,
    labelKey: PropTypes.string,
    attribute: PropTypes.string,
    value: PropTypes.any,
    accept: PropTypes.string,
    elementType: PropTypes.string,
    condition: PropTypes.bool,
};
