import { useState } from 'react';
import { Form } from 'modules/forms';
import AsyncSelect from 'react-select/async';

import { Label } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { RegistrySearchResultContainer } from 'modules/registry';

export default function RegistryNameForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    registryEntryId,
    registryEntryParent,
    registryNameTypes,
    normDataProviders,
    setRegistryEntryAttributes,
    projectId,
    projects,
    locale,
    searchRegistryEntry,
    foundRegistryEntries,
}) {
    const [selectedValue, setSelectedValue] = useState(null);
    const [inputValue, setValue] = useState('');
    const [geoFilter, setGeoFilter] = useState(null);
    const [placeType, setPlaceType] = useState(null);

    const defaultNameType = Object.values(registryNameTypes).find(r => r.code === 'spelling')
    const pathBase = usePathBase();

    const handleInputChange = value => {
        setValue(value);
    };

    const handleChange = value => {
        setSelectedValue(value);
        if (value) {
            setValue(value.Entry.Name);
            const preparedAttributes = {
                latitude: value.Entry.Location?.Latitude,
                longitude: value.Entry.Location?.Longitude,
                normDataAttributes: {
                    normDataProviderId: Object.values(normDataProviders).find( p => p.api_name === value.Entry.Provider ).id,
                    nid: value.Entry.ID,
                },
            };
            setRegistryEntryAttributes(preparedAttributes);
        }
    }

    function loadOptions(inputValue) {
        if (inputValue?.length > 3) {
            searchRegistryEntry(`${pathBase}/searches/registry_entry`, {fulltext: inputValue});
        }
        return fetch(`${pathBase}/norm_data_api?expression=${inputValue}&geo_filter=${geoFilter}&place_type=${placeType}`).then(res => res.json());
    };

    return (
        <Form
            scope='registry_name'
            onSubmit={function(params){submitData({projectId, projects, locale}, params, index);}}
            onSubmitCallback={onSubmitCallback}
            onCancel={onCancel}
            formClasses={formClasses}
            data={data}
            nested={nested}
            values={{
                registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                registry_name_type_id: (data?.registry_name_type_id) || defaultNameType.id,
                name_position: 1,
                translations_attributes: [{
                    descriptor: inputValue,
                    locale: 'de'
                }],
            }}
            submitText='submit'
            elements={[
                //{
                    //attribute: 'descriptor',
                    //multiLocale: true
                //},
                {
                    elementType: 'textarea',
                    multiLocale: true,
                    attribute: 'notes',
                },
                {
                    elementType: 'select',
                    attribute: 'registry_name_type_id',
                    value: (data?.registry_name_type_id) || defaultNameType.id,
                    values: registryNameTypes && Object.values(registryNameTypes),
                    validate: function(v){return /^\d+$/.test(v)}
                },
            ]}
        >
            <ul className="RegistryEntryList RegistryEntryList--root">
                {
                    foundRegistryEntries?.results?.map(result => <RegistrySearchResultContainer key={result.id} result={result} />)
                }
            </ul>
            <div className='form-group'>
                <Label
                    labelKey={'activerecord.attributes.registry_name.descriptor'}
                    mandatory={true}
                />
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
            </div>
        </Form>
    );
}
