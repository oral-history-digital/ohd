import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function RegistryHierarchyForm({
    registryHierarchy,
    descendantRegistryEntry,
    submitData,
    onSubmit,
    onCancel,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

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
                scope='registry_hierarchy'
                onSubmit={params => {
                    submitData({ locale, projectId, project }, params);
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
