import { createElement } from 'react';
import { useI18n } from 'modules/i18n';

export default function Extra({
    html,
    tag,
    className,
    textKey,
    children,
}) {
    if (html) return html;

    const { t } = useI18n();
    const Tag = tag || 'div';

    return (
        <Tag className={className} >
            {textKey && t(textKey)}
        </Tag>
    );
}
