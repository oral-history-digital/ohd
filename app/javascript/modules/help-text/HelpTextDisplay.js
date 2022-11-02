import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function HelpTextDisplay({
    data
}) {
    const { t, locale } = useI18n();

    return (
        <dl className="DescriptionList">
            <dt>{t('activerecord.attributes.default.id')}</dt>
            <dd>{data.id}</dd>
            <dt>{t('activerecord.attributes.help_text.code')}</dt>
            <dd>{data.code}</dd>
            <dt>{t('activerecord.attributes.help_text.description')}</dt>
            <dd>{data.description}</dd>
            <dt>{t('activerecord.attributes.help_text.text')}</dt>
            <dd>{data.text}</dd>
            <dt>{t('activerecord.attributes.help_text.url')}</dt>
            <dd>{data.url}</dd>
            <dt>{t('activerecord.attributes.default.created_at')}</dt>
            <dd>{(new Date(data.created_at)).toLocaleString(locale)}</dd>
            <dt>{t('activerecord.attributes.default.updated_at')}</dt>
            <dd>{(new Date(data.updated_at)).toLocaleString(locale)}</dd>
        </dl>
    );
}

HelpTextDisplay.propTypes = {
    data: PropTypes.object.isRequired,
};
