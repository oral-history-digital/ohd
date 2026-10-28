import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { useSegmentSaveNotification } from 'modules/transcript/hooks';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

/**
 * Edits segment headings and reports their save status.
 *
 * @param {Object} props - Heading form properties.
 * @param {Object} props.segment - Segment with stored heading translations.
 * @param {Function} [props.onSubmit] - Called after a successful save.
 * @param {Function} [props.onCancel] - Cancels editing.
 * @param {Function} [props.onChange] - Handles form changes.
 * @param {string} [props.submitText] - Submit label key.
 * @param {string} [props.cancelText] - Cancel label key.
 * @returns {React.ReactElement} Heading form with save notifications.
 */
export default function SegmentHeadingForm({
    segment,
    onSubmit,
    onCancel,
    onChange,
    submitText,
    cancelText,
}) {
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const {
        isSaving,
        saveNotification,
        handleSaveStart,
        dismissSaveNotification,
    } = useSegmentSaveNotification(segment?.id);

    const submitHandler = (params) => {
        handleSaveStart();

        const afterSubmitCallback =
            typeof onSubmit === 'function' ? onSubmit : undefined;

        dispatch(submitData({ pathBase }, params, {}, afterSubmitCallback));
    };

    return (
        <div>
            <Form
                scope="segment"
                onSubmit={(params) => {
                    submitHandler(params);
                }}
                onCancel={onCancel}
                onChange={onChange}
                fetching={isSaving}
                data={segment}
                values={{
                    translations_attributes:
                        segment?.translations_attributes || [],
                }}
                disableIfUnchanged={true}
                notification={saveNotification}
                onDismissNotification={dismissSaveNotification}
                helpTextCode="language_form"
                submitText={submitText || 'submit'}
                cancelText={cancelText || 'cancel'}
                elements={[
                    {
                        attribute: 'mainheading',
                        multiLocale: true,
                        group: 'mainheading',
                    },
                    {
                        attribute: 'subheading',
                        multiLocale: true,
                        group: 'subheading',
                    },
                ]}
                formClasses="SegmentHeadingForm"
            />
        </div>
    );
}

SegmentHeadingForm.propTypes = {
    segment: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    submitText: PropTypes.string,
    cancelText: PropTypes.string,
};
