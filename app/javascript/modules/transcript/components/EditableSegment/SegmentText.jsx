import classNames from 'classnames';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { formatTimecode } from 'modules/interview-helpers';
import PropTypes from 'prop-types';
import {
    checkTextDir,
    enforceRtlOnTranscriptTokens,
    unescapeHtmlEntities,
} from '../../utils';

export default function SegmentText({
    segment,
    locale,
    isActive,
    handleClick,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();

    let text = isAuthorized(segment, 'update')
        ? segment.text[locale] || segment.text[`${locale}-public`]
        : segment.text[`${locale}-public`];

    const textDir = checkTextDir(text);
    // Enforce RTL wrapping if the text direction is RTL
    text = textDir === 'rtl' ? enforceRtlOnTranscriptTokens(text) : text;

    const label = `Jump to ${formatTimecode(segment.time, true)}`;

    return (
        <button
            type="button"
            className={classNames('Segment-text', { 'is-active': isActive })}
            lang={locale}
            dir={segment.textDir || 'auto'}
            title={label}
            aria-label={label}
            onClick={handleClick}
        >
            {unescapeHtmlEntities(text) || (
                <i>{t('modules.transcript.no_text')}</i>
            )}
        </button>
    );
}

SegmentText.propTypes = {
    segment: PropTypes.object.isRequired,
    locale: PropTypes.string,
    isActive: PropTypes.bool,
    handleClick: PropTypes.func,
};
