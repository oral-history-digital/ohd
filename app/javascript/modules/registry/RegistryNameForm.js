import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

import RegistrySearchResult from './RegistrySearchResult';

/**
 * Edits a registry name, preserving nested-form placement and descriptor search.
 *
 * @param {Object} props - Name form properties.
 * @param {number} [props.index] - Position used when adding a nested name.
 * @param {Function} props.submitData - Saves through Redux or updates the parent form.
 * @param {Function} [props.onSubmitCallback] - Callback forwarded to the shared form.
 * @param {Function} [props.onCancel] - Closes the form without saving.
 * @param {string} [props.formClasses] - Additional form classes.
 * @param {Object} [props.data] - Existing name attributes.
 * @param {boolean} [props.nested] - Enables nested-form behavior.
 * @param {number} [props.registryEntryId] - Owning entry; omit while creating a new entry.
 * @param {Object} props.registryNameTypes - Available name types keyed by ID.
 * @param {Object} [props.foundRegistryEntries] - Existing entry search results.
 * @param {Function} props.searchRegistryEntry - Searches existing entries by descriptor.
 * @param {Function} props.setDescriptor - Updates the parent form's search descriptor.
 * @returns {React.ReactElement} Name form with optional existing-entry suggestions.
 */
export default function RegistryNameForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    registryEntryId,
    registryNameTypes,
    foundRegistryEntries,
    searchRegistryEntry,
    setDescriptor,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    // TODO: Is this necessary? It triggers the form to close if registry entry is a search result
    //useEffect(() => {
    //searchRegistryEntry(`${pathBase}/searches/registry_entry`, {});
    //}, []);

    const defaultNameType = Object.values(registryNameTypes).find(
        (r) => r.code === 'spelling'
    );

    const handleDescriptorChange = (name, value) => {
        setDescriptor(value);
        if (!registryEntryId && value?.length > 3) {
            searchRegistryEntry(`${pathBase}/searches/registry_entry`, {
                fulltext: value,
            });
        }
    };

    const formElements = [
        {
            elementType: 'select',
            attribute: 'registry_name_type_id',
            value: data?.registry_name_type_id || defaultNameType.id,
            values: registryNameTypes && Object.values(registryNameTypes),
            validate: function (v) {
                return /^\d+$/.test(v);
            },
        },
        {
            attribute: 'descriptor',
            multiLocale: true,
            validate: function (v) {
                return v && v.length > 1;
            },
            handlechangecallback: handleDescriptorChange,
            origAsLocale: true,
        },
    ];

    return (
        <Form
            scope="registry_name"
            onSubmit={(params) => {
                // For nested forms, index is used by Form's handleNestedFormSubmit
                // to insert new items at the correct array position. For existing
                // items (Redux action), the index parameter is ignored.
                // Routing between handlers is managed by the forms module.
                submitData({ pathBase }, params, index);
            }}
            helpTextCode="registry_name_form"
            onSubmitCallback={onSubmitCallback}
            onCancel={onCancel}
            formClasses={formClasses}
            data={data}
            nested={nested}
            values={{
                registry_entry_id: data?.registry_entry_id || registryEntryId,
                registry_name_type_id:
                    data?.registry_name_type_id || defaultNameType.id,
                name_position: 1,
                translations_attributes: data?.translations_attributes || [],
            }}
            submitText="submit"
            elements={formElements}
        >
            {!registryEntryId && foundRegistryEntries?.results?.length > 0 && (
                <>
                    <h6>{`${t('existing_registry_entries')}:`}</h6>
                    <ul className="RegistryEntryList RegistryEntryList--root">
                        {foundRegistryEntries?.results?.map((result) => (
                            <RegistrySearchResult
                                key={result.id}
                                result={result}
                                hideCheckbox
                                hideEditButtons
                            />
                        ))}
                    </ul>
                </>
            )}
        </Form>
    );
}

RegistryNameForm.propTypes = {
    index: PropTypes.number,
    submitData: PropTypes.func.isRequired,
    onSubmitCallback: PropTypes.func,
    onCancel: PropTypes.func,
    formClasses: PropTypes.string,
    data: PropTypes.object,
    nested: PropTypes.bool,
    registryEntryId: PropTypes.number,
    registryNameTypes: PropTypes.object.isRequired,
    foundRegistryEntries: PropTypes.object,
    searchRegistryEntry: PropTypes.func.isRequired,
    setDescriptor: PropTypes.func.isRequired,
};
