import { useState } from 'react';

import { Form, SingleTextInputForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

/**
 * Submits text replacements for the interview's selected transcript language.
 *
 * @param {Object} props - Text-marking context.
 * @param {Function} props.submitData - Saves replacements through Redux.
 * @param {Object} props.interview - Interview with a public ID and content languages.
 * @param {string|number} props.archiveId - Public interview identifier used for status lookup.
 * @param {Object} [props.markTextStatus] - Text-marking request statuses.
 * @returns {React.ReactElement} Replacement form and status message.
 */
export default function MarkTextForm({
    submitData,
    interview,
    archiveId,
    markTextStatus,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const [showForm, setShowForm] = useState(true);

    const showMarkedText = (value) => {
        return (
            <span>
                {value.text_to_mark}: {value.replacement}
            </span>
        );
    };

    const form = () => {
        if (showForm) {
            return (
                <Form
                    scope="mark_text"
                    onSubmit={function (params) {
                        submitData({ pathBase }, params);
                        setShowForm(false);
                    }}
                    helpTextCode="mark_text_form"
                    values={{
                        id: interview.archive_id,
                    }}
                    elements={[
                        {
                            elementType: 'select',
                            attribute: 'locale',
                            values: interview.alpha3s.reduce((acc, alpha3) => {
                                acc[alpha3] = { name: t(alpha3) };
                                return acc;
                            }, {}),
                            doNotTranslate: true,
                            withEmpty: true,
                            validate: function (v) {
                                return v !== '';
                            },
                            individualErrorMsg: 'empty',
                        },
                    ]}
                    nestedScopeProps={[
                        {
                            formComponent: SingleTextInputForm,
                            formProps: {},
                            parent: interview,
                            scope: 'text',
                            elementRepresentation: showMarkedText,
                        },
                    ]}
                />
            );
        }
    };

    const msg = () => {
        let text = markTextStatus[`for_interviews_${archiveId}`]
            ? t('edit.text.' + markTextStatus[`for_interviews_${archiveId}`])
            : t('edit.mark_text.explanation');
        return (
            <div>
                <p>{text}</p>
            </div>
        );
    };

    return (
        <div>
            {msg()}
            {form()}
        </div>
    );
}

MarkTextForm.propTypes = {
    submitData: PropTypes.func.isRequired,
    interview: PropTypes.shape({
        archive_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        alpha3s: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    archiveId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    markTextStatus: PropTypes.object,
};
