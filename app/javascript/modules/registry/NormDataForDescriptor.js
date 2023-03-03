import React, { useState } from 'react';
import classNames from 'classnames';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { updateRegistryNameAttributes, updateNormDataAttributes } from './updateRegistryEntryAttributes';
import { Spinner } from 'modules/spinners';

function NormDataForDescriptor({
    locale,
    project,
    setRegistryEntryAttributes,
    registryEntryAttributes,
    registryNameTypes,
    normDataProviders,
    descriptor,
    setFromAPI,
    onSubmitCallback,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const [filter, setFilter] = useState(null);
    const [placeTypeFilter, setPlaceTypeFilter] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [apiResult, setApiResult] = useState({});

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
            .then(json => setApiResult(json));
    };

    const displayResults = () => {
        if (apiResult.success) {
            return (
                apiResult.response?.items?.length === 0 ?
                    <p className='notifications'>
                       {t('modules.interview_search.no_results')}
                    </p> :
                    <ul>
                        {apiResult.response.items.map( result => {
                            return (
                                <li>
                                    <a onClick={ () => {
                                        setRegistryEntryAttributes({
                                            latitude: result.Entry.Location?.Latitude,
                                            longitude: result.Entry.Location?.Longitude,
                                            ...updateRegistryNameAttributes(result.Entry, registryNameTypes, registryEntryAttributes, project, locale),
                                            ...updateNormDataAttributes(result.Entry, normDataProviders, registryEntryAttributes),
                                        });
                                        onSubmitCallback();
                                        setFromAPI(false);
                                    }} >
                                        {`${result.Entry.Name}: ${result.Entry.Label}, ${result.Entry.Type}`}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
            );
        } else if (apiResult.error) {
            return (<p className='notifications'>
                {t('error')}
            </p>);
        } else {
            return (<Spinner />);
        }
    }

    return ( showResults ?
        displayResults() :
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
