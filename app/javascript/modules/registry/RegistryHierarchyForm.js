import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

/**
 * Adds or edits a registry hierarchy relationship through the current route.
 *
 * @param {Object} props - Form properties.
 * @param {Object} [props.registryHierarchy] - Existing relationship to edit.
 * @param {Object} [props.descendantRegistryEntry] - Entry receiving a parent.
 * @param {Function} props.submitData - Saves the relationship through Redux.
 * @param {Function} props.onSubmit - Called after starting the save.
 * @param {Function} [props.onCancel] - Closes the form without saving.
 * @returns {React.ReactElement} Hierarchy relationship form.
 */
export default function RegistryHierarchyForm({
    registryHierarchy,
    descendantRegistryEntry,
    submitData,
    onSubmit,
    onCancel,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    return (
        <div>
            {descendantRegistryEntry && (
                <div>
                    <span>
                        <b>{t('edit.registry_entry.add_parent') + ': '}</b>
                    </span>
                    <span>{descendantRegistryEntry.name[locale]}</span>
                </div>
            )}

            <Form
                scope="registry_hierarchy"
                onSubmit={(params) => {
                    submitData({ pathBase }, params);
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                data={registryHierarchy}
                values={{
                    descendant_id: descendantRegistryEntry?.id,
                }}
                elements={[
                    {
                        attribute: 'ancestor_id',
                    },
                ]}
            />
        </div>
    );
}

RegistryHierarchyForm.propTypes = {
    descendantRegistryEntry: PropTypes.object,
    registryHierarchy: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    submitData: PropTypes.func.isRequired,
};
