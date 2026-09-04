import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export default function HomepageBlockForm({
    block,
    code,
    index,
    isSubmitting,
    notification,
    onDismissNotification,
    onSubmit,
}) {
    const { t } = useI18n();

    function imageForLocale(imageLocale) {
        return block.images?.find((image) => image.locale === imageLocale);
    }

    function currentImage(imageLocale) {
        const image = imageForLocale(imageLocale);
        if (!image?.src) {
            return [];
        }

        return {
            id: image.id,
            name:
                image.filename ||
                `${t('edit.instance.block.image_file')} (${imageLocale.toUpperCase()})`,
            url: image.src,
            contentType: 'image/*',
        };
    }

    const elements = [
        {
            attribute: 'heading',
            label: t('edit.instance.block.heading'),
            multiLocale: true,
        },
        {
            attribute: 'text',
            elementType: 'textarea',
            label: t('edit.instance.block.text'),
            multiLocale: true,
            htmlOptions: { rows: 2 },
        },
        {
            attribute: 'image_file_de',
            elementType: 'fileInput',
            accept: 'image/*',
            preview: 'image',
            label: `${t('edit.instance.block.image_file')} (DE)`,
            currentFiles: currentImage('de'),
        },
        {
            attribute: 'image_file_en',
            elementType: 'fileInput',
            accept: 'image/*',
            preview: 'image',
            label: `${t('edit.instance.block.image_file')} (EN)`,
            currentFiles: currentImage('en'),
        },
        {
            attribute: 'image_alt',
            label: t('edit.instance.block.image_alt'),
            multiLocale: true,
        },
        {
            attribute: 'button_primary_label',
            label: t('edit.instance.block.button_primary_label'),
            multiLocale: true,
        },
        {
            attribute: 'button_primary_description',
            label: t('edit.instance.block.button_primary_description'),
            multiLocale: true,
        },
        {
            attribute: 'button_secondary_label',
            label: t('edit.instance.block.button_secondary_label'),
            multiLocale: true,
        },
        {
            attribute: 'button_secondary_description',
            label: t('edit.instance.block.button_secondary_description'),
            multiLocale: true,
        },
        {
            attribute: 'button_primary_target',
            label: t('edit.instance.block.button_primary_target'),
        },
        {
            attribute: 'button_secondary_target',
            label: t('edit.instance.block.button_secondary_target'),
        },
        {
            attribute: 'show_secondary_button',
            elementType: 'input',
            type: 'checkbox',
            label: t('edit.instance.block.show_secondary_button'),
        },
    ];

    const values = {
        id: block.id,
        code: block.code || code,
        position: block.position ?? index,
        button_primary_target: block.button_primary_target || '',
        button_secondary_target: block.button_secondary_target || '',
        show_secondary_button: !!block.show_secondary_button,
    };

    return (
        <Form
            data={block}
            values={values}
            scope="homepage_block"
            submitText="submit"
            elements={elements}
            fetching={isSubmitting}
            notification={notification}
            onDismissNotification={onDismissNotification}
            onSubmit={(params) => onSubmit(code, index, params)}
        />
    );
}

HomepageBlockForm.propTypes = {
    block: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    isSubmitting: PropTypes.bool,
    notification: PropTypes.object,
    onDismissNotification: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
