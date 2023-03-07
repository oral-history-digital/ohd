import { useState } from 'react';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import NormDataForDescriptorContainer from './NormDataForDescriptorContainer';

export default function NormDatumForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    registryEntryId,
    descriptor,
    norm_data_provider_id,
    nid,
    projectId,
    projects,
    normDataProviders,
    locale,
    setRegistryEntryAttributes,
    registryEntryAttributes,
}) {

    const { t } = useI18n();
    const pathBase = usePathBase();
    const [fromAPI, setFromAPI] = useState(false);

    return (
        <>
            { descriptor &&
                <button
                    type="button"
                    className="Button any-button"
                    onClick={() => {
                        setFromAPI(!fromAPI);
                    }}
                >
                    {fromAPI ? t('back') : t('search_in_normdata', {descriptor: descriptor})}
                </button>
            }
            { fromAPI ?
                <NormDataForDescriptorContainer
                    descriptor={descriptor}
                    setRegistryEntryAttributes={setRegistryEntryAttributes}
                    registryEntryAttributes={registryEntryAttributes}
                    setFromAPI={setFromAPI}
                    onSubmitCallback={onSubmitCallback}
                /> :
                <Form
                    scope='norm_datum'
                    helpTextCode="norm_datum_form"
                    onSubmit={params => {
                        const paramsWithSelectedEntryValues = {
                            norm_datum: Object.assign({}, params.norm_datum, {
                                registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                                norm_data_provider_id: norm_data_provider_id,
                                nid:  nid,
                            }),
                        };
                        submitData({projectId, locale, projects}, nid ? paramsWithSelectedEntryValues : params, index);
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                    onSubmitCallback={onSubmitCallback}
                    onCancel={onCancel}
                    formClasses={formClasses}
                    data={data}
                    nested={nested}
                    values={{
                        registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                    }}
                    submitText='submit'
                    elements={[
                        {
                            attribute: 'norm_data_provider_id',
                            elementType: 'select',
                            value: norm_data_provider_id,
                            values: normDataProviders,
                            validate: function(v){return /^\d+$/.test(v)},
                            withEmpty: true,
                        },
                        {
                            attribute: 'nid',
                            value: nid,
                            validate: function(v){return /^[a-zA-Z0-9-_/]+$/.test(v)},
                        },
                    ]}
                />
            }
        </>
    );
}
