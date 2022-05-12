import { useState } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import NormDataSelectContainer from './NormDataSelectContainer';

export default function RegistryEntryFromNormDataForm({
    submitData,
    onSubmit,
    onCancel,
    parentId,
    projects,
    projectId,
    locale,
    registryEntryParent,
}) {
    const { t } = useI18n();
    const [registryEntryAttributes, setRegistryEntryAttributes] = useState({})

    return (
        <>
            <NormDataSelectContainer
                setRegistryEntryAttributes={setRegistryEntryAttributes}
                registryEntryParent={registryEntryParent}
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
