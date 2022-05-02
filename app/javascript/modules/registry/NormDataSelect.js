import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import request from 'superagent';

import { useI18n } from 'modules/i18n';

function NormDataSelect({
    setRegistryEntryAttributes,
    registryEntryParent,
    registryNameTypes,
}) {
    const { t } = useI18n();
    const [inputValue, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);

    const normDataRegistryNameType = Object.values(registryNameTypes).filter(r => r.code === 'norm_data')[0];
    const handleInputChange = value => {
        setValue(value);
    };

    //{"registry_entry"=>{"parent_id"=>"1", "workflow_state"=>"preliminary", "latitude"=>"8768", "longitude"=>"78687", "registry_names_attributes"=>[{"registry_entry_id"=>"", "registry_name_type_id"=>"4", "name_position"=>"1", "translations_attributes"=>{"0"=>{"descriptor"=>"skjfhksjh", "locale"=>"de", "notes"=>"kjjhkjhkj"}, "1"=>{"descriptor"=>"kjjhkjh", "locale"=>"en", "notes"=>"kjjhkjh"}}}]}, "locale"=>"de"}

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
            };
            setRegistryEntryAttributes(preparedAttributes);
        }
    }

    const loadOptions = (inputValue) => {
        return fetch(`/de/norm_data_api?expression=${inputValue}`).then(res => res.json());
    };

    return (
        <div className="NormData">
        {/*<pre>Input Value: "{inputValue}"</pre>*/}
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={selectedValue}
                getOptionLabel={e => `${e.Entry.Name}: ${e.Entry.Label}`}
                getOptionValue={e => e.Entry.ID}
                loadOptions={loadOptions}
                onInputChange={handleInputChange}
                onChange={handleChange}
            />
        {/*<pre>Selected Value: {JSON.stringify(selectedValue || {}, null, 2)}</pre>*/}
        </div>
    );
}

export default NormDataSelect;
