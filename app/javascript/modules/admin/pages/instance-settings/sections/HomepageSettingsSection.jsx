import { useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';

import { InstanceSettingsSection } from '../components';
import { HomepageBlockForm } from '../forms';
import { useInstanceSettings } from '../hooks';

const blockCodes = ['hero', 'panel_interview', 'panel_register'];

export default function HomepageSettingsSection() {
    const { t } = useI18n();
    const [blockNotifications, setBlockNotifications] = useState({});
    const [tabIndex, setTabIndex] = useState(0);
    const {
        error,
        instanceSettings,
        isLoading,
        isSubmitting,
        updateInstanceSettings,
    } = useInstanceSettings();

    function blockName(code) {
        return t(`edit.instance.blocks.${code}`);
    }

    function blockData(code) {
        return instanceSettings?.blocks?.[code] || null;
    }

    function blockImageForLocale(code, imageLocale) {
        const block = blockData(code);
        return (
            block?.images?.find((item) => item.locale === imageLocale) || null
        );
    }

    function mergeTranslations(code, updatedTranslations) {
        const mergedByLocale = new Map();
        blockData(code)?.translations_attributes?.forEach((translation) => {
            mergedByLocale.set(translation.locale, { ...translation });
        });
        Object.values(updatedTranslations || {}).forEach((translation) => {
            mergedByLocale.set(translation.locale, {
                ...mergedByLocale.get(translation.locale),
                ...translation,
            });
        });
        return Array.from(mergedByLocale.values());
    }

    function setBlockNotification(code, notification) {
        setBlockNotifications((previous) => ({
            ...previous,
            [code]: notification,
        }));
    }

    async function submitBlock(code, index, params) {
        const values = params.homepage_block || {};
        const block = blockData(code);
        const baseBlock = {
            id: block?.id || values.id,
            code: block?.code || values.code || code,
            position: block?.position ?? values.position ?? index,
            button_primary_target: values.button_primary_target,
            button_secondary_target: values.button_secondary_target,
            show_secondary_button: values.show_secondary_button,
            translations_attributes: mergeTranslations(
                code,
                values.translations_attributes
            ),
        };
        const imageUpdates = ['de', 'en']
            .map((locale) => {
                const image = blockImageForLocale(code, locale);
                const file = values[`image_file_${locale}`];
                return {
                    id: image?.id,
                    locale,
                    file: file instanceof File ? file : null,
                };
            })
            .filter((image) => image.id || image.file);

        try {
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
            for (let index = 1; index < imageUpdates.length; index += 1) {
                result = await updateInstanceSettings({
                    homepage_setting: {
                        blocks: [
                            {
                                id: baseBlock.id,
                                code: baseBlock.code,
                                position: baseBlock.position,
                                image: imageUpdates[index],
                            },
                        ],
                    },
                });
            }
            setBlockNotification(code, {
                variant: 'success',
                title: t('edit.instance.notification.success.title'),
                autoHideDuration: 1000,
            });
            return result;
        } catch (submitError) {
            setBlockNotification(code, {
                variant: 'error',
                title: t('edit.instance.notification.error.title'),
                description:
                    submitError?.message ||
                    t('edit.instance.notification.error.description'),
            });
            throw submitError;
        }
    }

    return (
        <InstanceSettingsSection
            title={t('edit.instance.homepage_section_title')}
        >
            {isLoading && <Spinner withPadding />}
            {!isLoading && error && <p>{error.message}</p>}
            {!isLoading && !error && instanceSettings && (
                <Tabs
                    className="AdminEditInstance-tabs"
                    index={tabIndex}
                    onChange={setTabIndex}
                    keyboardActivation="manual"
                >
                    <TabList className="AdminEditInstance-tabList">
                        {blockCodes.map((code) => (
                            <Tab key={code} className="AdminEditInstance-tab">
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
                                        isSubmitting={isSubmitting}
                                        notification={
                                            blockNotifications[code] || null
                                        }
                                        onDismissNotification={() =>
                                            setBlockNotification(code, null)
                                        }
                                        onSubmit={submitBlock}
                                    />
                                </TabPanel>
                            );
                        })}
                    </TabPanels>
                </Tabs>
            )}
        </InstanceSettingsSection>
    );
}
