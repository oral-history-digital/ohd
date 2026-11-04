import { useState } from 'react';

import { submitData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { CancelButton, SubmitButton } from 'modules/ui/Buttons';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import RichTextEditor from 'react-rte-18support';

/**
 * Creates or edits a localized annotation and saves it through Redux on the current route.
 * @param {Object} props - Annotation, segment, content locale, button labels, and save/cancel callbacks.
 * @returns {React.ReactElement} Rich-text annotation form.
 */
export default function AnnotationForm({
    annotation,
    segment,
    contentLocale,
    onSubmit,
    onCancel,
    submitLabel,
    cancelLabel,
}) {
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const [values, setValues] = useState(() => ({
        id: annotation?.id,
        locale: contentLocale,
        segment_id: segment.id,
        interview_id: segment.interview_id,
        text: annotation?.text?.[contentLocale]
            ? RichTextEditor.createValueFromString(
                  annotation.text[contentLocale],
                  'html'
              )
            : RichTextEditor.createEmptyValue(),
    }));

    /**
     * Serializes a separate payload so the editor value survives failed saves and retries.
     * @param {React.FormEvent<HTMLFormElement>} event - Form submission.
     */
    function handleSubmit(event) {
        event.preventDefault();
        dispatch(
            submitData(
                { pathBase },
                {
                    annotation: {
                        ...values,
                        text: values.text.toString('html'),
                    },
                },
                {},
                onSubmit
            )
        );
    }

    return (
        <form id="annotation" className="Form" onSubmit={handleSubmit}>
            <RichTextEditor
                value={values.text}
                toolbarConfig={{ display: ['LINK_BUTTONS', 'HISTORY_BUTTONS'] }}
                onChange={(text) =>
                    setValues((previous) => ({ ...previous, text }))
                }
            />
            <div className="Form-footer u-mt">
                <div className="Form-footer-buttons">
                    <CancelButton
                        buttonText={cancelLabel}
                        handleCancel={onCancel}
                    />
                    <SubmitButton buttonText={submitLabel} />
                </div>
            </div>
        </form>
    );
}

AnnotationForm.propTypes = {
    annotation: PropTypes.object,
    segment: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    submitLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
};
