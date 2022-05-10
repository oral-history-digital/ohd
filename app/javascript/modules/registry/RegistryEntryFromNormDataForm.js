import { useState } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import NormDataSelect from './NormDataSelect';

export default function RegistryEntryFromNormDataForm({
    submitData,
    onSubmit,
    onCancel,
    parentId,
    projects,
    normDataProviders,
    projectId,
    locale,
    registryEntryParent,
    registryNameTypes,
}) {
    const { t } = useI18n();
    const [registryEntryAttributes, setRegistryEntryAttributes] = useState({})

    return (
        <>
            <NormDataSelect
                setRegistryEntryAttributes={setRegistryEntryAttributes}
                registryEntryParent={registryEntryParent}
                registryNameTypes={registryNameTypes}
                normDataProviders={normDataProviders}
            />
            <Form
                onSubmit={() => {
                    submitData({projectId, locale, projects}, {registry_entry: registryEntryAttributes});
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                elements={[]}
            />
        </>
    );
}

RegistryEntryFromNormDataForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
