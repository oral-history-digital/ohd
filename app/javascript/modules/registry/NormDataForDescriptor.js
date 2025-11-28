import React, { useEffect, useState } from 'react';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';

import UpdateRegistryEntryAttributesModal from './UpdateRegistryEntryAttributesModal';

function NormDataForDescriptor({
    setRegistryEntryAttributes,
    registryEntryAttributes,
    registryNameTypes,
    normDataProviders,
    descriptor,
    onSubmitCallback,
    setShowElementsInForm,
    setResultsFromNormDataSet,
    replaceNestedFormValues,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const [filter, setFilter] = useState(null);
    //const [placeTypeFilter, setPlaceTypeFilter] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [apiResult, setApiResult] = useState({});
    const [from, setFrom] = useState(0);

    useEffect(() => {
        setShowResults(false);
        setFrom(0);
    }, [descriptor]);

    let formElements = [
        {
            elementType: 'select',
            attribute: 'api',
            labelKey: 'normdata.api',
            values: [
                'gnd_geo',
                'wikidata_geo',
                'geonames_geo',
                'openstreetmap_geo',
                'gnd_people',
                'gnd_terms',
                'gnd_entities',
            ],
            //withEmpty: true,
            optionsScope: 'normdata',
            keepOrder: true,
            handlechangecallback: (name, value) => setFilter(value),
        },
    ];

    //let formElements = [
    //{
    //elementType: 'select',
    //attribute: 'filter_select',
    //labelKey: 'normdata.filter_select',
    //values: ['none', 'geo'],
    //withEmpty: true,
    //optionsScope: 'normdata',
    //handlechangecallback: (name, value) => setFilter(value),
    //}
    //];

    //if (filter === 'geo') {
    //formElements = formElements.concat([
    //{
    //elementType: 'select',
    //attribute: 'geo_filter',
    //labelKey: 'normdata.geo_filter',
    //values: ['de', 'eu'],
    //withEmpty: true,
    //optionsScope: 'normdata',
    //},
    //{
    //elementType: 'select',
    //attribute: 'place_type',
    //labelKey: 'normdata.place_type',
    //values: ['location', 'placeOfWorship', 'natural', 'historic', 'tourism'],
    //withEmpty: true,
    //optionsScope: 'normdata',
    //handlechangecallback: (name, value) => setPlaceTypeFilter(value),
    //},
    //])
    //}

    //if (placeTypeFilter === 'location') {
    //formElements = formElements.concat([
    //{
    //elementType: 'select',
    //attribute: 'place_extended',
    //values: [
    //'continent', 'country', 'state',
    //'region', 'province', 'district', 'municipality',
    //'city', 'town',
    //'borough', 'suburb', 'quarter',
    //'village', 'hamlet', 'farm'
    //],
    //withEmpty: true,
    //optionsScope: 'normdata',
    //},
    //])
    //}

    const fetchAPIResults = async (params) => {
        const urlAndFilters = [
            `${pathBase}/norm_data_api?expression=${descriptor}`,
        ];
        ['geo_filter', 'place_type', 'place_extended', 'api'].forEach(
            (filter) => {
                if (params[filter]) {
                    urlAndFilters.push(`${filter}=${params[filter]}`);
                }
            }
        );

        if (params['from']) {
            urlAndFilters.push(`from=${params['from']}`);
        }

        fetch(urlAndFilters.join('&'))
            .then((res) => res.json())
            .then((json) => setApiResult(json));
    };

    const displayResults = () => {
        //if (apiResult.success) {
        if (apiResult.response) {
            const items = apiResult.response?.items;

            return (
                <>
                    {(Array.isArray(items) ? items : [items]).length === 0 ? (
                        <p className="notifications">
                            {t('modules.interview_search.no_results')}
                        </p>
                    ) : (
                        <ul>
                            {(Array.isArray(items) ? items : [items]).map(
                                (result) => {
                                    return (
                                        <li key={result.Entry.ID}>
                                            <>
                                                <UpdateRegistryEntryAttributesModal
                                                    entry={result.Entry}
                                                    apiSearchTerm={descriptor}
                                                    registryEntryAttributes={
                                                        registryEntryAttributes
                                                    }
                                                    registryNameTypes={
                                                        registryNameTypes
                                                    }
                                                    normDataProviders={
                                                        normDataProviders
                                                    }
                                                    setRegistryEntryAttributes={
                                                        setRegistryEntryAttributes
                                                    }
                                                    setShowElementsInForm={
                                                        setShowElementsInForm
                                                    }
                                                    setResultsFromNormDataSet={
                                                        setResultsFromNormDataSet
                                                    }
                                                    replaceNestedFormValues={
                                                        replaceNestedFormValues
                                                    }
                                                />
                                                {result.Entry.Identifier.filter(
                                                    (p) => !!p.URL
                                                ).map((p) => {
                                                    return (
                                                        <a
                                                            key={p.Value}
                                                            href={p.URL}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="Link flyout-sub-tabs-content-ico-link"
                                                            title={t(
                                                                'norm_data.link_hover'
                                                            )}
                                                        >
                                                            &nbsp;{p.Provider}
                                                            &nbsp;
                                                        </a>
                                                    );
                                                })}
                                            </>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    )}
                    {from >= 10 && (
                        <button
                            type="button"
                            className="Icon Icon--secondary"
                            onClick={() => {
                                setFrom(from - 10);
                                fetchAPIResults({ from: from - 10 });
                            }}
                        >
                            {t('previous')}
                        </button>
                    )}
                    <button
                        type="button"
                        className="Icon Icon--primary u-ml-tiny"
                        onClick={() => {
                            setFrom(from + 10);
                            fetchAPIResults({ from: from + 10 });
                        }}
                    >
                        {t('next')}
                    </button>
                    <button
                        type="button"
                        className="Icon Icon--primary u-ml-tiny"
                        onClick={() => {
                            setShowResults(false);
                            setApiResult({});
                            setFrom(0);
                        }}
                    >
                        {t('normdata.reset')}
                    </button>
                </>
            );
        } else if (apiResult.error) {
            return <p className="notifications">{t('error')}</p>;
        } else {
            return <Spinner />;
        }
    };

    return showResults ? (
        displayResults()
    ) : (
        <Form
            scope="normdata"
            formClasses={'nested-form default'}
            onSubmit={(params) => {
                !showResults && fetchAPIResults(params.normdata);
                setShowResults(!showResults);
            }}
            elements={formElements}
            helpTextCode="normdata_form"
            submitText={t('search')}
        />
    );
}

export default NormDataForDescriptor;
