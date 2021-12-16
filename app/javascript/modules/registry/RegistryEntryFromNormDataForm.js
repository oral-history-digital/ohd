import { useState } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import NormDataSelect from './NormDataSelect';

export default function RegistryEntryFromNormDataForm({
    submitData,
    onSubmit,
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
                className={'RegistryEntry default'}
                onSubmit={() => {
                    submitData({projectId, locale, projects}, {registry_entry: registryEntryAttributes});
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
            >
                <input
                    className="Button"
                    type="submit"
                    value={t('submit')}
                />
                <input
                    type='button'
                    className="Button"
                    value={t('cancel')}
                    onClick={() => {
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                />
            </form>
        </>
    );
}

RegistryEntryFromNormDataForm.propTypes = {
    onSubmit: PropTypes.func,
};
