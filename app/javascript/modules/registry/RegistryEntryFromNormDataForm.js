import { useState } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import NormDataSelect from './NormDataSelect';

export default function RegistryEntryFromNormDataForm({
    submitData,
    onSubmit,
    onCancel,
    parentId,
    projects,
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
            />
            <form
                className="Form RegistryEntry default"
                onSubmit={() => {
                    submitData({projectId, locale, projects}, {registry_entry: registryEntryAttributes});
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
            >
                <div className="Form-footer u-mt">
                    <input
                        className="Button Button--primaryAction"
                        type="submit"
                        value={t('submit')}
                    />
                    <input
                        type='button'
                        className="Button Button--secondaryAction"
                        value={t('cancel')}
                        onClick={() => {
                            if (typeof onSubmit === 'function') {
                                onSubmit();
                            }
                        }}
                    />
                </div>
            </form>
        </>
    );
}

RegistryEntryFromNormDataForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
