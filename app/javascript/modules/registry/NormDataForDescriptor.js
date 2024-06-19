import React, { useState, useEffect } from 'react';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { updateRegistryNameAttributes, updateNormDataAttributes }
    from './updateRegistryEntryAttributes';
import { Spinner } from 'modules/spinners';

function NormDataForDescriptor({
    setRegistryEntryAttributes,
    registryEntryAttributes,
    registryNameTypes,
    normDataProviders,
    descriptor,
    onSubmitCallback,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const { project } = useProject();
    const [filter, setFilter] = useState(null);
    const [placeTypeFilter, setPlaceTypeFilter] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [apiResult, setApiResult] = useState({});

    useEffect(() => {
        setShowResults(false);
    }, [descriptor]);

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

    const show = (entry) => {
        return (
            entry.AlternateName.find(n => n.Lang === locale)?.Name + ', ' +
            entry.Description.find(n => n.Lang === locale)?.Description.substr(0, 60) + '...'
        );
    }

    const fetchAPIResults = async(params) => {
        const urlAndFilters = [`${pathBase}/norm_data_api?expression=${descriptor}`];
        ['geo_filter', 'place_type', 'place_extended'].forEach((filter) => {
            if (params[filter]) {
                urlAndFilters.push(`${filter}=${params[filter]}`);
            }
        });

        fetch(urlAndFilters.join('&'))
            .then(res => res.json())
            .then(json => setApiResult(json));
    };

    const displayResults = () => {
        //if (apiResult.success) {
        if (apiResult.response) {
            console.log(apiResult);
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
                                    }} >
                                        {show(result.Entry)}
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
            //elements={[]}
            elements={formElements}
            helpTextCode="normdata_form"
        />
    );
}

export default NormDataForDescriptor;
