import { useState } from 'react';
import { FaRegFileAlt, FaRegClone, FaList, FaSearch, FaTags } from 'react-icons/fa';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import NormDataForDescriptorContainer from './NormDataForDescriptorContainer';

export default function NormDatumForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    registryEntryId,
    descriptor,
    norm_data_provider_id,
    nid,
    normDataProviders,
    setRegistryEntryAttributes,
    registryEntryAttributes,
    setShowElementsInForm,
}) {

    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const pathBase = usePathBase();
    const [manual, setManual] = useState(false);

    return (
        <Tabs
            className="Tabs"
            keyboardActivation="manual"
        >
            <div className="Layout-contentTabs">
                <TabList className="Tabs-tabList">
                    <Tab className="Tabs-tab">
                        <FaRegFileAlt className="Tabs-tabIcon"/>
                        <span className="Tabs-tabText">
                            {t('search_in_normdata')}
                        </span>
                    </Tab>
                    <Tab className="Tabs-tab">
                        <FaRegClone className="Tabs-tabIcon"/>
                        <span className="Tabs-tabText">
                            {t('enter_normdata_manually')}
                        </span>
                    </Tab>
                </TabList>
            </div>

            <div className='wrapper-content'>
                <TabPanels>
                    <TabPanel>
                        { descriptor ?
                            <>
                                <p>{t('search_api_for', {descriptor: descriptor})}</p>
                                <NormDataForDescriptorContainer
                                    descriptor={descriptor}
                                    setRegistryEntryAttributes={setRegistryEntryAttributes}
                                    registryEntryAttributes={registryEntryAttributes}
                                    onSubmitCallback={onSubmitCallback}
                                    setShowElementsInForm={setShowElementsInForm}
                                />
                            </>: <p>{t('enter_descriptor_first')}</p>
                        }
                    </TabPanel>
                    <TabPanel>
                        <Form
                            scope='norm_datum'
                            helpTextCode="norm_datum_form"
                            onSubmit={params => {
                                const paramsWithSelectedEntryValues = {
                                    norm_datum: Object.assign({}, params.norm_datum, {
                                        registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                                        norm_data_provider_id: norm_data_provider_id,
                                        nid:  nid,
                                    }),
                                };
                                submitData({projectId, locale, project}, nid ? paramsWithSelectedEntryValues : params, index);
                                if (typeof onSubmit === 'function') {
                                    onSubmit();
                                }
                            }}
                            onSubmitCallback={onSubmitCallback}
                            onCancel={onCancel}
                            formClasses={formClasses}
                            data={data}
                            nested={nested}
                            values={{
                                registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                            }}
                            submitText='submit'
                            elements={[
                                {
                                    attribute: 'norm_data_provider_id',
                                    elementType: 'select',
                                    value: norm_data_provider_id,
                                    values: normDataProviders,
                                    validate: function(v){return /^\d+$/.test(v)},
                                    withEmpty: true,
                                },
                                {
                                    attribute: 'nid',
                                    value: nid,
                                    validate: function(v){return /^[a-zA-Z0-9-_/]+$/.test(v)},
                                },
                            ]}
                        />
                    </TabPanel>
                </TabPanels>
            </div>
        </Tabs>
    );
}
