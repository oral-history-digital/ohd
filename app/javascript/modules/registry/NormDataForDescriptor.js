import React, { useState } from 'react';
import classNames from 'classnames';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { updateRegistryNameAttributes, updateNormDataAttributes } from './updateRegistryEntryAttributes';

function NormDataForDescriptor({
    locale,
    project,
    setRegistryEntryAttributes,
    registryEntryAttributes,
    registryNameTypes,
    normDataProviders,
    descriptor,
    setFromAPI,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const [filter, setFilter] = useState(null);
    const [placeTypeFilter, setPlaceTypeFilter] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [apiResults, setApiResults] = useState([]);

    let formElements = [
        {
            elementType: 'select',
            attribute: 'filter_select',
            labelKey: 'normdata.filter_select',
            values: ['none', 'geo'],
            withEmpty: true,
            optionsScope: 'normdata',
            handlechangecallback: (name, value) => setFilter(value),
        }
    ];

    if (filter === 'geo') {
        formElements = formElements.concat([
            {
                elementType: 'select',
                attribute: 'geo_filter',
                labelKey: 'normdata.geo_filter',
                values: ['de', 'eu'],
                withEmpty: true,
                optionsScope: 'normdata',
            },
            {
                elementType: 'select',
                attribute: 'place_type',
                labelKey: 'normdata.place_type',
                values: ['town', 'placeOfWorship', 'natural', 'historic', 'tourism'],
                withEmpty: true,
                optionsScope: 'normdata',
                handlechangecallback: (name, value) => setPlaceTypeFilter(value),
            },
        ])
    }

    //if (placeTypeFilter === 'town') {
        //formElements = formElements.concat([
            //{
                //elementType: 'select',
                //attribute: 'place_extended',
                //values: ['continent', 'state', 'country'],
                //withEmpty: true,
                //optionsScope: 'normdata',
            //},
        //])
    //}

    const fetchAPIResults = async(params) => {
        const filters = [
            `geo_filter=${params.geo_filter}`,
            `place_type=${params.place_type}`,
            //`place=${params.place_extended}`,
        ]
        fetch(`${pathBase}/norm_data_api?expression=${descriptor}&` + filters.join('&'))
            .then(res => res.json())
            .then(json => setApiResults(json));
    };

    return ( showResults ?
        <ul>
            {apiResults.map( result => {
                return (
                    <li>
                        <a onClick={ () => {
                            setRegistryEntryAttributes({
                                latitude: result.Entry.Location?.Latitude,
                                longitude: result.Entry.Location?.Longitude,
                                ...updateRegistryNameAttributes(result.Entry, registryNameTypes, registryEntryAttributes, project, locale),
                                ...updateNormDataAttributes(result.Entry, normDataProviders, registryEntryAttributes),
                            });
                            setFromAPI(false);
                        }} >
                            {`${result.Entry.Name}: ${result.Entry.Label}, ${result.Entry.Type}`}
                        </a>
                    </li>
                )
            })}
        </ul> :
        <Form
            scope='normdata'
            formClasses={'nested-form default'}
            onSubmit={(params) => {
                !showResults && fetchAPIResults(params.normdata);
                setShowResults(!showResults);
            }}
            elements={formElements}
            helpTextCode="normdata_form"
        />
    );
}

export default NormDataForDescriptor;
