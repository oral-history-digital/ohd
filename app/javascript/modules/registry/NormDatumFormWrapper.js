import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaRegClone, FaRegFileAlt } from 'react-icons/fa';

import NormDataForDescriptorContainer from './NormDataForDescriptorContainer';

export default function NormDatumFormWrapper({
    onSubmitCallback,
    onCancel, // TODO: use onCancel or remove it
    descriptor,
    registryEntryAttributes,
    setRegistryEntryAttributes,
    setShowElementsInForm,
    setResultsFromNormDataSet,
    replaceNestedFormValues,
    children,
}) {
    const { t } = useI18n();

    return (
        <Tabs className="Tabs" keyboardActivation="manual">
            <div className="Layout-contentTabs">
                <TabList className="Tabs-tabList">
                    <Tab className="Tabs-tab">
                        <FaRegFileAlt className="Tabs-tabIcon" />
                        <span className="Tabs-tabText">
                            {t('search_in_normdata')}
                        </span>
                    </Tab>
                    <Tab className="Tabs-tab">
                        <FaRegClone className="Tabs-tabIcon" />
                        <span className="Tabs-tabText">
                            {t('enter_normdata_manually')}
                        </span>
                    </Tab>
                </TabList>
            </div>

            <div className="u-mt-small">
                <TabPanels>
                    <TabPanel>
                        {descriptor ? (
                            <>
                                <p>
                                    {t('search_api_for', {
                                        descriptor: descriptor,
                                    })}
                                </p>
                                <NormDataForDescriptorContainer
                                    descriptor={descriptor}
                                    setRegistryEntryAttributes={
                                        setRegistryEntryAttributes
                                    }
                                    registryEntryAttributes={
                                        registryEntryAttributes
                                    }
                                    onSubmitCallback={onSubmitCallback}
                                    setShowElementsInForm={
                                        setShowElementsInForm
                                    }
                                    setResultsFromNormDataSet={
                                        setResultsFromNormDataSet
                                    }
                                    replaceNestedFormValues={
                                        replaceNestedFormValues
                                    }
                                />
                            </>
                        ) : (
                            <p>{t('enter_descriptor_first')}</p>
                        )}
                    </TabPanel>
                    <TabPanel>
                        <span className="Tabs-tabText">
                            {t('extend_normdata_manually')}
                        </span>
                        {children}
                    </TabPanel>
                </TabPanels>
            </div>
        </Tabs>
    );
}

NormDatumFormWrapper.propTypes = {
    onSubmitCallback: PropTypes.func,
    onCancel: PropTypes.func,
    descriptor: PropTypes.string,
    registryEntryAttributes: PropTypes.object,
    setRegistryEntryAttributes: PropTypes.func,
    setShowElementsInForm: PropTypes.func,
    setResultsFromNormDataSet: PropTypes.func,
    replaceNestedFormValues: PropTypes.func,
    children: PropTypes.node.isRequired,
};
