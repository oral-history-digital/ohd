import React, { useState } from 'react';

import { Element } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import AsyncSelect from 'react-select/async';
import request from 'superagent';

function NormDataSelect({
    setRegistryEntryAttributes,
    registryEntryParent,
    registryNameTypes,
    normDataProviders,
    searchRegistryEntry,
    descriptor,
    setDescriptor,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const [inputValue, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const [geoFilter, setGeoFilter] = useState(null);
    const [placeType, setPlaceType] = useState(null);
    const [api, setApi] = useState('gnd');

    const defaultNameType = Object.values(registryNameTypes).find(
        (r) => r.code === 'spelling'
    );
    const handleInputChange = (value) => {
        setValue(value);
        if (value?.length > 0) {
            setDescriptor(value);
            setRegistryEntryAttributes({
                registry_names_attributes: [
                    {
                        registry_name_type_id: defaultNameType.id,
                        name_position: 1,
                        translations_attributes: [
                            {
                                descriptor: value,
                                locale: locale,
                            },
                        ],
                    },
                ],
            });
        }
    };

    const handleChange = (value) => {
        setSelectedValue(value);
        setDescriptor(value.Entry.Name);
        if (value) {
            const preparedAttributes = {
                parent_id: registryEntryParent?.id,
                workflow_state: 'preliminary',
                latitude: value.Entry.Location?.Latitude,
                longitude: value.Entry.Location?.Longitude,
                registry_names_attributes: [
                    {
                        registry_name_type_id: defaultNameType.id,
                        name_position: 1,
                        translations_attributes: [
                            {
                                descriptor: value.Entry.Name,
                                locale: locale,
                            },
                        ],
                    },
                ],
                norm_data_attributes: [
                    {
                        norm_data_provider_id: Object.values(
                            normDataProviders
                        ).find((p) => p.api_name === value.Entry.Provider).id,
                        nid: value.Entry.ID,
                    },
                ],
            };
            setRegistryEntryAttributes(preparedAttributes);
        }
    };

    const loadOptions = (inputValue) => {
        if (inputValue?.length > 3) {
            searchRegistryEntry(`${pathBase}/searches/registry_entry`, {
                fulltext: inputValue,
            });
        }
        return fetch(
            `${pathBase}/norm_data_api?expression=${inputValue}&geo_filter=${geoFilter}&place_type=${placeType}&api=${api}`
        ).then((res) => res.json());
    };

    return (
        <div className="form-group">
            <Element labelKey="normdata.geo_filter">
                <select
                    key={'geoFilter-select'}
                    className="Input"
                    onChange={(e) => setGeoFilter(e.target.value)}
                >
                    <option value="" key={'geoFilter-choose'}>
                        {t('choose')}
                    </option>
                    {['de', 'eu'].map((v) => (
                        <option value={v} key={`geoFilter-${v}`}>
                            {t(`normdata.${v}`)}
                        </option>
                    ))}
                </select>
            </Element>
            <Element labelKey="normdata.place_type">
                <select
                    key={'placeType-select'}
                    className="Input"
                    onChange={(e) => setPlaceType(e.target.value)}
                >
                    <option value="" key={'placeType-choose'}>
                        {t('choose')}
                    </option>
                    {[
                        'town',
                        'placeOfWorship',
                        'natural',
                        'historic',
                        'tourism',
                    ].map((v) => (
                        <option value={v} key={`geoFilter-${v}`}>
                            {t(`normdata.${v}`)}
                        </option>
                    ))}
                </select>
            </Element>
            <AsyncSelect
                cacheOptions
                defaultOptions
                isClearable
                backspaceRemovesValue
                defaultInputValue={descriptor}
                value={selectedValue}
                getOptionLabel={(e) => `${e.Entry.Name}: ${e.Entry.Label}`}
                getOptionValue={(e) => e.Entry.ID}
                loadOptions={(value) => loadOptions(value)}
                onInputChange={handleInputChange}
                onChange={handleChange}
            />
        </div>
    );
}

export default NormDataSelect;
