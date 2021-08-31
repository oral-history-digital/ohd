import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import request from 'superagent';

import { useI18n } from 'modules/i18n';

function NormDataSelect({setRegistryEntryAttributes}) {
    const { t } = useI18n();
    const [inputValue, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);

    const handleInputChange = value => {
        setValue(value);
    };

    //{"registry_entry"=>{"parent_id"=>"1", "workflow_state"=>"preliminary", "latitude"=>"8768", "longitude"=>"78687", "registry_names_attributes"=>[{"registry_entry_id"=>"", "registry_name_type_id"=>"4", "name_position"=>"1", "translations_attributes"=>{"0"=>{"descriptor"=>"skjfhksjh", "locale"=>"de", "notes"=>"kjjhkjhkj"}, "1"=>{"descriptor"=>"kjjhkjh", "locale"=>"en", "notes"=>"kjjhkjh"}}}]}, "locale"=>"de"}

    const handleChange = value => {
        setSelectedValue(value);
        if (selectedValue) {
            debugger
            const preparedAttributes = {
                latitude: selectedValue.Location?.Coord[0],
                longitude: selectedValue.Location?.Coord[1],
                registry_names_attributes: [{
                    registry_name_type_id: 4,
                    name_position: 1,
                    translations_attributes: {
                        0: {
                            descriptor: selectedValue.Name,
                            locale: 'de'
                        }
                    }
                }],
            };
            setRegistryEntryAttributes(preparedAttributes);
        }
    }

    const loadOptions = (inputValue) => {
        return fetch(`/norm_data?expression=${inputValue}`).then(res => res.json());
    };

    return (
        <div className="NormData">
            <h3>{t('activerecord.attributes.registry_entries.from_norm_data')}</h3>
            <pre>Input Value: "{inputValue}"</pre>
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={selectedValue}
                getOptionLabel={e => e.Entry.Name}
                getOptionValue={e => e.Entry.ID}
                loadOptions={loadOptions}
                onInputChange={handleInputChange}
                onChange={handleChange}
            />
            <pre>Selected Value: {JSON.stringify(selectedValue || {}, null, 2)}</pre>
        </div>
    );
}

export default NormDataSelect;
