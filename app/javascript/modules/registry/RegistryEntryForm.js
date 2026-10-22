import { useState } from 'react';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

import NormDatumFormContainer from './NormDatumFormContainer';
import NormDatumFormWrapper from './NormDatumFormWrapper';
import RegistryNameFormContainer from './RegistryNameFormContainer';

/**
 * Creates or edits registry entries, preserving nested names and authority data.
 *
 * @param {Object} props - Form properties.
 * @param {Object} props.normDataProviders - Authority providers keyed by ID.
 * @param {Object} props.registryEntries - Cached entries keyed by ID.
 * @param {number} [props.registryEntryId] - Entry to edit; omit when creating.
 * @param {Object} [props.registryEntryParent] - Parent for the new or edited entry.
 * @param {Function} props.submitData - Saves through Redux using the current route.
 * @param {Function} [props.onSubmit] - Called after starting the save.
 * @param {Function} [props.onCancel] - Closes the form without saving.
 * @returns {React.ReactElement} Registry entry form.
 */
export default function RegistryEntryForm({
    normDataProviders,
    registryEntries,
    registryEntryId,
    registryEntryParent,
    submitData,
    onSubmit,
    onCancel,
}) {
    const pathBase = usePathBase();
    const { t, locale } = useI18n();
    const registryEntry = registryEntries[registryEntryId];
    const [descriptor, setDescriptor] = useState(initialDescriptor());
    const [registryEntryAttributes, setRegistryEntryAttributes] = useState({
        ...registryEntry,
        has_geo_coords: !!registryEntry?.has_geo_coords,
    });
    const [showElementsInForm, setShowElementsInForm] = useState(false);
    //const [showElementsInForm, setShowElementsInForm] = useState(!registryEntry);
    const [resultsFromNormDataSet, setResultsFromNormDataSet] = useState(false);

    const values = {
        parent_id: registryEntryParent?.id,
        workflow_state: registryEntry?.workflow_state || 'preliminary',
        has_geo_coords: !!registryEntry?.has_geo_coords,
    };

    function initialDescriptor() {
        const registryName = registryEntry?.registry_names[0];
        return registryName?.descriptor ? registryName.descriptor[locale] : '';
    }

    function showRegistryName(registryName) {
        if (!registryName) return null;
        const translation = registryName.translations_attributes.find(
            (t) => t.locale === locale
        );
        return <span>{translation?.descriptor}</span>;
    }

    function showNormDatum(normDatum) {
        return (
            <span>{`${
                normDataProviders[normDatum.norm_data_provider_id]?.name
            } - ${normDatum.nid} `}</span>
        );
    }

    function parentRegistryEntry() {
        if (registryEntryParent) {
            return (
                <div>
                    <span>
                        <b>{t('edit.registry_entry.parent') + ': '}</b>
                    </span>
                    <span>{registryEntryParent.name[locale]}</span>
                </div>
            );
        }
    }

    return (
        <div>
            {parentRegistryEntry()}
            <Form
                key={registryEntryId}
                scope="registry_entry"
                onSubmit={(params) => {
                    const updatedParams = {
                        registry_entry: Object.assign(
                            {},
                            registryEntryAttributes,
                            params.registry_entry
                        ),
                    };
                    submitData({ pathBase }, updatedParams);
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                helpTextCode="registry_entry_form"
                data={registryEntryAttributes}
                values={values}
                elements={[
                    {
                        elementType: 'textarea',
                        multiLocale: true,
                        attribute: 'notes',
                    },
                    {
                        attribute: 'latitude',
                        //validate: validateGeoCoordinate,
                        optional: true,
                        individualErrorMsg: 'format',
                    },
                    {
                        attribute: 'longitude',
                        //validate: validateGeoCoordinate,
                        optional: true,
                        individualErrorMsg: 'format',
                    },
                    //{
                    //elementType: 'select',
                    //attribute: 'workflow_state',
                    //values: ['preliminary', 'public', 'rejected'],
                    //value: registryEntry?.workflow_state || 'preliminary',
                    //withEmpty: true,
                    //optionsScope: 'workflow_states',
                    //}
                ]}
                nestedScopeProps={[
                    {
                        formComponent: RegistryNameFormContainer,
                        formProps: {
                            registryEntryId: registryEntryId,
                            registryEntryParent: registryEntryParent,
                            setRegistryEntryAttributes:
                                setRegistryEntryAttributes,
                            registryEntryAttributes,
                            setDescriptor: setDescriptor,
                            index: 0,
                        },
                        parent: registryEntryAttributes,
                        scope: 'registry_name',
                        elementRepresentation: showRegistryName,
                        showElementsInForm: showElementsInForm,
                        disableAddingElements: resultsFromNormDataSet,
                    },
                    {
                        wrapperComponent: NormDatumFormWrapper,
                        formComponent: NormDatumFormContainer,
                        formProps: {
                            descriptor: descriptor,
                            registryEntryId: registryEntryId,
                            setRegistryEntryAttributes:
                                setRegistryEntryAttributes,
                            registryEntryAttributes: registryEntryAttributes,
                            setShowElementsInForm: setShowElementsInForm,
                            setResultsFromNormDataSet:
                                setResultsFromNormDataSet,
                        },
                        parent: registryEntryAttributes,
                        scope: 'norm_datum',
                        elementRepresentation: showNormDatum,
                        showElementsInForm: showElementsInForm,
                    },
                ]}
            />
        </div>
    );
}

RegistryEntryForm.propTypes = {
    registryEntryId: PropTypes.number,
    registryEntryParent: PropTypes.object,
    registryEntries: PropTypes.object.isRequired,
    normDataProviders: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    submitData: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
