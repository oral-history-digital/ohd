import { useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { useInstanceSettings } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { Helmet } from 'react-helmet';

import { EditViewOrRedirect } from '../../components';
import HomepageBlockForm from './HomepageBlockForm';
import InstanceSettingsForm from './InstanceSettingsForm';

export default function InstanceSettingsAdminPage() {
    const { t } = useI18n();
    const [instanceNotification, setInstanceNotification] = useState(null);
    const [blockNotifications, setBlockNotifications] = useState({});
    const {
        isLoading,
        isSubmitting,
        error,
        instanceSettings,
        updateInstanceSettings,
    } = useInstanceSettings();

    const [tabIndex, setTabIndex] = useState(0);

    const blockCodes = ['hero', 'panel_interview', 'panel_register'];

    function blockName(code) {
        return t(`edit.instance.blocks.${code}`);
    }
    function blockData(code) {
        return instanceSettings?.blocks?.[code] || null;
    }

    function blockImageForLocale(code, imageLocale) {
        const block = blockData(code);
        if (!block?.images) {
            return null;
        }

        return block.images.find((item) => item.locale === imageLocale) || null;
    }

    // Merges existing translations with updated translations,
    // giving precedence to updated ones in case of conflict
    function mergeTranslations(code, updatedTranslations) {
        const existingTranslations =
            blockData(code)?.translations_attributes || [];
        const updatesArray = Array.isArray(updatedTranslations)
            ? updatedTranslations
            : Object.values(updatedTranslations || {});

        const mergedByLocale = new Map();
        existingTranslations.forEach((translation) => {
            mergedByLocale.set(translation.locale, { ...translation });
        });
        updatesArray.forEach((translation) => {
            const current = mergedByLocale.get(translation.locale) || {};
            mergedByLocale.set(translation.locale, {
                ...current,
                ...translation,
            });
        });

        return Array.from(mergedByLocale.values());
    }

    function setBlockNotification(code, notification) {
        setBlockNotifications((previousNotifications) => ({
            ...previousNotifications,
            [code]: notification,
        }));
    }

    async function submitWithNotification(requestCallback, setNotification) {
        try {
            const result = await requestCallback();

            setNotification({
                variant: 'success',
                title: t('edit.instance.notification.success.title'),
                autoHideDuration: 1000,
            });

            return result;
        } catch (submitError) {
            setNotification({
                variant: 'error',
                title: t('edit.instance.notification.error.title'),
                description:
                    submitError?.message ||
                    t('edit.instance.notification.error.description'),
            });
            throw submitError;
        }
    }

    async function submitInstanceHandler(params) {
        const values = params.homepage_setting || {};

        return submitWithNotification(
            () =>
                updateInstanceSettings({
                    homepage_setting: {
                        umbrella_project_id: values.umbrella_project_id,
                    },
                }),
            setInstanceNotification
        );
    }

    async function submitBlockHandler(code, index, params) {
        const values = params.homepage_block || {};
        const block = blockData(code);
        const imageDe = blockImageForLocale(code, 'de');
        const imageEn = blockImageForLocale(code, 'en');
        const translationsAttributes = mergeTranslations(
            code,
            values.translations_attributes
        );

        const baseBlock = {
            id: block?.id || values.id,
            code: block?.code || values.code || code,
            position: block?.position ?? values.position ?? index,
            button_primary_target: values.button_primary_target,
            button_secondary_target: values.button_secondary_target,
            show_secondary_button: values.show_secondary_button,
            translations_attributes: translationsAttributes,
        };

        const imageUpdates = [
            {
                id: imageDe?.id,
                locale: 'de',
                file:
                    values.image_file_de instanceof File
                        ? values.image_file_de
                        : null,
            },
            {
                id: imageEn?.id,
                locale: 'en',
                file:
                    values.image_file_en instanceof File
                        ? values.image_file_en
                        : null,
            },
        ].filter((img) => img.id || img.file);

        return submitWithNotification(
            () =>
                (async () => {
                    let result = await updateInstanceSettings({
                        homepage_setting: {
                            blocks: [
                                {
                                    ...baseBlock,
                                    ...(imageUpdates[0]
                                        ? { image: imageUpdates[0] }
                                        : {}),
                                },
                            ],
                        },
                    });
                    for (let i = 1; i < imageUpdates.length; i += 1) {
                        result = await updateInstanceSettings({
                            homepage_setting: {
                                blocks: [
                                    {
                                        id: baseBlock.id,
                                        code: baseBlock.code,
                                        position: baseBlock.position,
                                        image: imageUpdates[i],
                                    },
                                ],
                            },
                        });
                    }

                    return result;
                })(),
            (notification) => setBlockNotification(code, notification)
        );
    }

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content AdminEditInstance">
                <Helmet>
                    <title>{t('edit.instance.title')}</title>
                </Helmet>

                <AuthShowContainer hasProjectAccess>
                    <AuthorizedContent
                        object={{ type: 'InstanceSetting' }}
                        action="update"
                    >
                        <h1 className="Page-main-title">
                            {t('edit.instance.title')}
                        </h1>
                        {isLoading && <Spinner withPadding />}
                        {!isLoading && error && <p>{error.message}</p>}
                        {!isLoading && !error && instanceSettings && (
                            <>
                                <InstanceSettingsForm
                                    instanceSettings={instanceSettings}
                                    isSubmitting={isSubmitting}
                                    notification={instanceNotification}
                                    onDismissNotification={() =>
                                        setInstanceNotification(null)
                                    }
                                    onSubmit={submitInstanceHandler}
                                />
                                <Tabs
                                    className="AdminEditInstance-tabs"
                                    index={tabIndex}
                                    onChange={setTabIndex}
                                    keyboardActivation="manual"
                                >
                                    <h2>
                                        {t(
                                            'edit.instance.homepage_section_title'
                                        )}
                                    </h2>
                                    <TabList className="AdminEditInstance-tabList">
                                        {blockCodes.map((code) => (
                                            <Tab
                                                key={code}
                                                className="AdminEditInstance-tab"
                                            >
                                                {blockName(code)}
                                            </Tab>
                                        ))}
                                    </TabList>

                                    <TabPanels className="AdminEditInstance-tabPanels">
                                        {blockCodes.map((code, index) => {
                                            const block = blockData(code) || {
                                                code,
                                                position: index,
                                                translations_attributes: [],
                                                images: [],
                                            };
                                            return (
                                                <TabPanel
                                                    key={code}
                                                    className="AdminEditInstance-tabPanel"
                                                >
                                                    <HomepageBlockForm
                                                        block={block}
                                                        code={code}
                                                        index={index}
                                                        isSubmitting={
                                                            isSubmitting
                                                        }
                                                        notification={
                                                            blockNotifications[
                                                                code
                                                            ] || null
                                                        }
                                                        onDismissNotification={() =>
                                                            setBlockNotification(
                                                                code,
                                                                null
                                                            )
                                                        }
                                                        onSubmit={
                                                            submitBlockHandler
                                                        }
                                                    />
                                                </TabPanel>
                                            );
                                        })}
                                    </TabPanels>
                                </Tabs>
                            </>
                        )}
                    </AuthorizedContent>
                </AuthShowContainer>

                <AuthShowContainer ifLoggedOut ifNoProject>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
