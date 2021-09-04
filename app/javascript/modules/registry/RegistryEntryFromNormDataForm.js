import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import NormDataSelect from './NormDataSelect';

export default function RegistryEntryFromNormDataForm({
    submitData,
    onSubmit,
    parentId,
    projects,
    projectId,
    locale,
    registryEntryParent,
    registryNameTypes,
}) {
    const { t } = useI18n();

    //{"registry_entry"=>{"parent_id"=>"1", "workflow_state"=>"preliminary", "latitude"=>"8768", "longitude"=>"78687", "registry_names_attributes"=>[{"registry_entry_id"=>"", "registry_name_type_id"=>"4", "name_position"=>"1", "translations_attributes"=>{"0"=>{"descriptor"=>"skjfhksjh", "locale"=>"de", "notes"=>"kjjhkjhkj"}, "1"=>{"descriptor"=>"kjjhkjh", "locale"=>"en", "notes"=>"kjjhkjh"}}}]}, "locale"=>"de"}

    const [registryEntryAttributes, setRegistryEntryAttributes] = useState({})

    return (
        <>
            <NormDataSelect
                setRegistryEntryAttributes={setRegistryEntryAttributes}
                registryEntryParent={registryEntryParent}
                registryNameTypes={registryNameTypes}
            />
            <form
                className={'RegistryEntry default'}
                onSubmit={() => submitData({projectId, locale, projects}, {registry_entry: registryEntryAttributes})}
            >

                <input type="submit" value={t('submit')}/>
                <input type='button' value={t('cancel')} onClick={() => onSubmit()}
                />
            </form>
        </>
    );
}
