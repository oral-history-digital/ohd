import { useState } from 'react';
import PropTypes from 'prop-types';

import { Form, validateGeoCoordinate } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import RegistryNameFormContainer from './RegistryNameFormContainer';
import NormDatumFormContainer from './NormDatumFormContainer';

export default function RegistryEntryForm({
    locale,
    projectId,
    projects,
    normDataProviders,
    translations,
    registryEntries,
    registryEntryId,
    registryEntryParent,
    submitData,
    onSubmit,
    onCancel,
}){

    const { t } = useI18n();
    const registryEntry = registryEntries[registryEntryId];
    const [registryEntryAttributes, setRegistryEntryAttributes] = useState({})

    function showRegistryName(registryName) {
        if (!registryName)
            return null;
        const translation = registryName.translations_attributes.find(t => t.locale === locale);
        return (<span>{translation.descriptor}</span>);
    }

    function showNormDatum(normDatum) {
        return (<span>{`${normDataProviders[normDatum.norm_data_provider_id].name} - ${normDatum.nid} `}</span>);
        //return (<span>{`${normDataProviders[normDatum.normDataProviderId].name} - ${normDatum.nid} `}</span>);
    }

    function parentRegistryEntry() {
        if (registryEntryParent){
            return (
                <div>
                    <span><b>{t('edit.registry_entry.parent') + ': '}</b></span>
                    <span>{registryEntryParent.name[locale]}</span>
                </div>
            )
        }
    }

    return (
        <div>
            {parentRegistryEntry()}
            <Form
                key={registryEntryId}
                scope='registry_entry'
                onSubmit={params => {
                    submitData({projectId, locale, projects}, params);
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                data={registryEntry}
                values={{
                    parent_id: registryEntryParent?.id,
                    workflow_state: registryEntry?.workflow_state || 'preliminary',
                    norm_data_attributes: registryEntryAttributes.normDataAttributes,
                }}
                elements={[
                    {
                        attribute: 'latitude',
                        value: registryEntryAttributes.latitude,
                        validate: validateGeoCoordinate,
                        optional: true,
                        individualErrorMsg: 'format',
                    },
                    {
                        attribute: 'longitude',
                        value: registryEntryAttributes.longitude,
                        validate: validateGeoCoordinate,
                        optional: true,
                        individualErrorMsg: 'format',
                    },
                    {
                        elementType: 'select',
                        attribute: 'workflow_state',
                        values: ['preliminary', 'public', 'rejected'],
                        value: registryEntry?.workflow_state || 'preliminary',
                        withEmpty: true,
                        optionsScope: 'workflow_states',
                    }
                ]}

                nestedScopeProps={[
                    {
                        formComponent: RegistryNameFormContainer,
                        formProps: {
                            registryEntryId: registryEntryId,
                            registryEntryParent: registryEntryParent,
                            setRegistryEntryAttributes: setRegistryEntryAttributes,
                        },
                        parent: registryEntry,
                        scope: 'registry_name',
                        elementRepresentation: showRegistryName,
                    },
                    {
                        formComponent: NormDatumFormContainer,
                        formProps: {
                            registryEntryId: registryEntryId,
                            ...(registryEntryAttributes.normDataAttributes)
                        },
                        parent: registryEntry,
                        scope: 'norm_datum',
                        elementRepresentation: showNormDatum,
                    }
                ]}
            />
        </div>
    );
}

RegistryEntryForm.propTypes = {
    registryEntryId: PropTypes.number,
    registryEntryParent: PropTypes.object,
    registryEntries: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    submitData: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
