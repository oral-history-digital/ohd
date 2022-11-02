import React, { useState } from 'react';
import classNames from 'classnames';

import { Element } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { updateRegistryNameAttributes } from './updateRegistryNameAttributes';

function NormDataForDescriptor({
    locale,
    setRegistryEntryAttributes,
    registryEntryAttributes,
    registryNameTypes,
    normDataProviders,
    descriptor,
    setFromAPI,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const [geoFilter, setGeoFilter] = useState(null);
    const [filter, setFilter] = useState(null);
    const [placeType, setPlaceType] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [apiResults, setApiResults] = useState([]);

    const fetchAPIResults = async() => {
        fetch(`${pathBase}/norm_data_api?expression=${descriptor}`)
            .then(res => res.json())
            .then(json => setApiResults(json));
    };

    const defaultNameType = Object.values(registryNameTypes).find(r => r.code === 'spelling')

    return ( showResults ?
        <ul>
            {apiResults.map( result => {
                return (
                    <li>
                        <a onClick={ () => {
                            setRegistryEntryAttributes({
                                latitude: result.Entry.Location?.Latitude,
                                longitude: result.Entry.Location?.Longitude,
                                ...updateRegistryNameAttributes(result.Entry.Name, defaultNameType.id, registryEntryAttributes, null, locale),
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
        <form
            className={classNames('Form', 'nested-form', 'default')}
            onSubmit={() => {
                !showResults && fetchAPIResults();
                setShowResults(!showResults);
            }}
        >
            <div className='form-group'>
                <Element
                    labelKey='normdata.filter_select'
                >
                    <select
                        key={'filter-select'}
                        className="Input"
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option value='' key={'filter-choose'}>
                            {t('choose')}
                        </option>
                        { ['none', 'geo'].map( v => (
                            <option value={v} key={`filter-${v}`}>
                                {t(`normdata.${v}`)}
                            </option>
                        ))}
                    </select>
                </Element>
                { filter === 'geo' &&
                    <>
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
                    </>
                }
            </div>
            <input
                type="submit"
                className="Button Button--primaryAction"
                value={t('search')}
            />
        </form>
    );
}

export default NormDataForDescriptor;
