/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- The scrollable issue list needs keyboard focus. */
import { useI18n } from 'modules/i18n';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

/**
 * Renders structured diagnostics as localized plain text, including source locations.
 * @param {Object} issue - Code, interpolation parameters, and source location.
 * @param {Function} t - Runtime translation function.
 * @returns {string} Diagnostic safe to render as React text.
 */
export function formatImportIssue({ code, params, location }, t) {
    const text = (key, values) =>
        [t(`import_validation.${key}`, values)].flat(Infinity).join('');
    const context = ['sheet', 'row', 'line', 'tape']
        .filter((key) => location[key] != null)
        .map((key) => text(`location.${key}`, { value: String(location[key]) }))
        .join(', ');
    let message = text(code, params);
    if (Object.prototype.hasOwnProperty.call(params, 'value')) {
        const value =
            params.value == null
                ? text('empty_value')
                : JSON.stringify(String(params.value).slice(0, 100));
        message = text('value_message', {
            field: text(`field.${location.field || 'timecode'}`),
            value,
            message,
        });
    }
    return context
        ? text('located_message', { location: context, message })
        : message;
}

/**
 * Announces pre-check status and displays a scrollable list of translated issues.
 * @param {Object} props - Validation status and structured issues.
 * @returns {React.ReactElement|null} Accessible validation feedback.
 */
export default function ImportValidationFeedback({ status, issues }) {
    const { t } = useI18n();
    if (status === 'idle') return null;
    return (
        <InlineNotification
            className="ImportValidationFeedback"
            variant={status === 'checking' ? 'info' : 'error'}
            title={t(`import_validation.${status}`)}
            role={status === 'checking' ? 'status' : 'alert'}
            isClosable={false}
            description={
                issues.length > 0 ? (
                    <ul
                        className="ImportValidationFeedback-issues"
                        tabIndex={0}
                        aria-label={t('import_validation.invalid')}
                    >
                        {issues.map((issue, index) => (
                            <li key={index}>{formatImportIssue(issue, t)}</li>
                        ))}
                    </ul>
                ) : undefined
            }
        />
    );
}

ImportValidationFeedback.propTypes = {
    status: PropTypes.string.isRequired,
    issues: PropTypes.array.isRequired,
};
