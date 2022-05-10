import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import request from 'superagent';

import { Element } from 'modules/forms';
import { useI18n } from 'modules/i18n';

function NormDataSelect({
    setRegistryEntryAttributes,
    registryEntryParent,
    registryNameTypes,
    normDataProviders,
}) {
    const { t } = useI18n();
    const [inputValue, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const [geoFilter, setGeoFilter] = useState(null);
    const [placeType, setPlaceType] = useState(null);

    const normDataRegistryNameType = Object.values(registryNameTypes).filter(r => r.code === 'norm_data')[0];
    const handleInputChange = value => {
        setValue(value);
    };

    const handleChange = value => {
        setSelectedValue(value);
        if (value) {
            const preparedAttributes = {
                parent_id: registryEntryParent?.id,
                workflow_state: 'preliminary',
                latitude: value.Entry.Location?.Latitude,
                longitude: value.Entry.Location?.Longitude,
                registry_names_attributes: [{
                    registry_name_type_id: normDataRegistryNameType.id,
                    name_position: 1,
                    translations_attributes: [{
                        descriptor: value.Entry.Name,
                        notes: `ID: ${value.Entry.ID}; Info: ${value.Entry.Label}`,
                        locale: 'de'
                    }],
                }],
                norm_data_attributes: [{
                    norm_data_provider_id: Object.values(normDataProviders).find( p => p.api_name === value.Entry.Provider ).id,
                    nid: value.Entry.ID,
                }],
            };
            setRegistryEntryAttributes(preparedAttributes);
        }
    }

    function loadOptions(inputValue) {
        return fetch(`/de/norm_data_api?expression=${inputValue}&geo_filter=${geoFilter}&place_type=${placeType}`).then(res => res.json());
    };

    return (
        <div className="NormData">
            <form className='Form default'>
                <Element
                    labelKey='geo_filter'
                >
                    <select
                        key={'geoFilter-select'}
                        className="Input"
                        onChange={e => setGeoFilter(e.target.value)}
                    >
                        <option value='' key={'geoFilter-choose'}>
                            {t('choose')}
                        </option>
                        { ['de', 'en', 'ru', 'el', 'es'].map( v => (
                            <option value={v} key={`geoFilter-${v}`}>
                                {t(v)}
                            </option>
                        ))}
                    </select>
                </Element>
                <Element
                    labelKey='place_type'
                >
                    <select
                        key={'placeType-select'}
                        className="Input"
                        onChange={e => setPlaceType(e.target.value)}
                    >
                        <option value='' key={'placeType-choose'}>
                            {t('choose')}
                        </option>
                        { ['town'].map( v => (
                            <option value={v} key={`geoFilter-${v}`}>
                                {t(v)}
                            </option>
                        ))}
                    </select>
                </Element>
                {/*<pre>Input Value: "{inputValue}"</pre>*/}
                <AsyncSelect
                    cacheOptions
                    defaultOptions
                    value={selectedValue}
                    getOptionLabel={e => `${e.Entry.Name}: ${e.Entry.Label}`}
                    getOptionValue={e => e.Entry.ID}
                    loadOptions={value => loadOptions(value)}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                />
                {/*<pre>Selected Value: {JSON.stringify(selectedValue || {}, null, 2)}</pre>*/}
            </form>
        </div>
    );
}

export default NormDataSelect;
