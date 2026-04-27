import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';

import { HighlightHtml } from '../HighlightText';

export function RichtextDetail({
    richtext,
    labelKey,
    highlightString,
    className,
}) {
    const { t } = useI18n();

    if (!richtext) return null;

    const sanitizedRichtext = sanitizeHtml(richtext, 'RICH_TEXT');

    return (
        <div
            className={classNames(
                'DescriptionList-group DescriptionList-group--richtext',
                className
            )}
        >
            {labelKey && (
                <dt className="DescriptionList-term">{t(labelKey)}</dt>
            )}
            <dd className="DescriptionList-description">
                <HighlightHtml
                    html={sanitizedRichtext}
                    query={highlightString}
                />
            </dd>
        </div>
    );
}

RichtextDetail.propTypes = {
    richtext: PropTypes.string,
    labelKey: PropTypes.string,
    highlightString: PropTypes.string,
    className: PropTypes.string,
};

export default RichtextDetail;
