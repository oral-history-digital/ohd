import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import request from 'superagent';

import { useI18n } from 'modules/i18n';

function NormDataSelect() {
    const { t } = useI18n();
    const [inputValue, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);

    const handleInputChange = value => {
        setValue(value);
    };

    const handleChange = value => {
        setSelectedValue(value);
    }

    const loadOptions = (inputValue) => {
        return fetch(`/norm_data?expression=${inputValue}`).then(res => res.json());
    };

    return (
        <div className="NormData">
            <h3>{t('activerecord.attributes.registry_name.from_norm_data')}</h3>
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
