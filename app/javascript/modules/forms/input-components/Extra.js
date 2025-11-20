import { createElement } from 'react';
import { useI18n } from 'modules/i18n';

export default function Extra({ html, tag, className, labelKey, children }) {
    if (html) return html;

    const { t } = useI18n();
    const Tag = tag || 'div';

    return <Tag className={className}>{labelKey && t(labelKey)}</Tag>;
}
