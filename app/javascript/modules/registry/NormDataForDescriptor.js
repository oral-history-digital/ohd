import React, { useState } from 'react';

import { Element } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

function NormDataForDescriptor({
    setRegistryEntryAttributes,
    registryNameTypes,
    normDataProviders,
    descriptor,
    setFromAPI,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const [geoFilter, setGeoFilter] = useState(null);
    const [placeType, setPlaceType] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [apiResults, setApiResults] = useState([]);

    const fetchAPIResults = async() => {
        fetch(`${pathBase}/norm_data_api?expression=${descriptor}`)
            .then(res => res.json())
            .then(json => setApiResults(json));
    };

    const defaultNameType = Object.values(registryNameTypes).find(r => r.code === 'spelling')

    //const loadOptions = inputValue => {
        //if (inputValue?.length > 3) {
            //searchRegistryEntry(`${pathBase}/searches/registry_entry`, {fulltext: inputValue});
        //}
        //return fetch(`${pathBase}/norm_data_api?expression=${inputValue}&geo_filter=${geoFilter}&place_type=${placeType}`).then(res => res.json());
    //};

    return ( showResults ?
        <ul>
            {apiResults.map( result => {
                return (
                    <li>
                        <a onClick={ () => {
                            setRegistryEntryAttributes({
                                latitude: result.Entry.Location?.Latitude,
                                longitude: result.Entry.Location?.Longitude,
                                norm_data_attributes: [{
                                    norm_data_provider_id: Object.values(normDataProviders).find( p => p.api_name === result.Entry.Provider ).id,
                                    nid: result.Entry.ID,
                                }],
                            });
                            setFromAPI(false);
                        }} >
                            {`${result.Entry.Name}: ${result.Entry.Label}`}
                        </a>
                    </li>
                )
            })}
        </ul> :
        <div className='form-group'>
            <Element
                labelKey='normdata.geo_filter'
            >
                <select
                    key={'geoFilter-select'}
                    className="Input"
                    onChange={e => setGeoFilter(e.target.value)}
                >
                    <option value='' key={'geoFilter-choose'}>
                        {t('choose')}
                    </option>
                    { ['de', 'eu'].map( v => (
                        <option value={v} key={`geoFilter-${v}`}>
                            {t(`normdata.${v}`)}
                        </option>
                    ))}
                </select>
            </Element>
            <Element
                labelKey='normdata.place_type'
            >
                <select
                    key={'placeType-select'}
                    className="Input"
                    onChange={e => setPlaceType(e.target.value)}
                >
                    <option value='' key={'placeType-choose'}>
                        {t('choose')}
                    </option>
                    { ['town', 'placeOfWorship', 'natural', 'historic', 'tourism'].map( v => (
                        <option value={v} key={`geoFilter-${v}`}>
                            {t(`normdata.${v}`)}
                        </option>
                    ))}
                </select>
            </Element>
            <button
                type="button"
                className="Button any-button"
                onClick={() => {
                    !showResults && fetchAPIResults();
                    setShowResults(!showResults);
                }}
            >
                {t('search')}
            </button>
        </div>
    );
}

export default NormDataForDescriptor;
