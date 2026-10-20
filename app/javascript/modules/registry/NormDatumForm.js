import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

/**
 * Edits manual authority identifiers while preserving nested-form placement.
 *
 * @param {Object} props - Authority data form properties.
 * @param {number} [props.index] - Position used when adding nested authority data.
 * @param {Function} props.submitData - Saves through Redux or updates the parent form.
 * @param {Function} [props.onSubmitCallback] - Callback forwarded to the shared form.
 * @param {Function} [props.onCancel] - Closes the form without saving.
 * @param {string} [props.formClasses] - Additional form classes.
 * @param {Object} [props.data] - Existing authority identifier.
 * @param {boolean} [props.nested] - Enables nested-form behavior.
 * @param {number} [props.registryEntryId] - Entry receiving the identifier.
 * @param {Object} props.normDataProviders - Available authority providers keyed by ID.
 * @returns {React.ReactElement} Provider and identifier form.
 */
export default function NormDatumForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    registryEntryId,
    normDataProviders,
}) {
    const pathBase = usePathBase();

    return (
        <Form
            scope="norm_datum"
            helpTextCode="norm_datum_form"
            onSubmit={(params) => {
                // For nested forms, index is used by Form's handleNestedFormSubmit
                // to insert new items at the correct array position. For existing
                // items (Redux action), the index parameter is ignored.
                // Routing between handlers is managed by the forms module.
                submitData({ pathBase }, params, index);
            }}
            onSubmitCallback={onSubmitCallback}
            onCancel={onCancel}
            formClasses={formClasses}
            data={data}
            nested={nested}
            values={{
                registry_entry_id: data?.registry_entry_id || registryEntryId,
                value: data?.nid,
            }}
            submitText="submit"
            elements={[
                {
                    attribute: 'norm_data_provider_id',
                    elementType: 'select',
                    value: data?.norm_data_provider_id,
                    values: normDataProviders,
                    validate: function (v) {
                        return /^\d+$/.test(v);
                    },
                    withEmpty: true,
                },
                {
                    attribute: 'nid',
                    value: data?.nid,
                    //validate: function(v){return /^[a-zA-Z0-9-_/]+$/.test(v)},
                },
            ]}
        />
    );
}

NormDatumForm.propTypes = {
    index: PropTypes.number,
    submitData: PropTypes.func.isRequired,
    onSubmitCallback: PropTypes.func,
    onCancel: PropTypes.func,
    formClasses: PropTypes.string,
    data: PropTypes.object,
    nested: PropTypes.bool,
    registryEntryId: PropTypes.number,
    normDataProviders: PropTypes.object.isRequired,
};
