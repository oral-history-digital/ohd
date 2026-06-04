import { getLocale, getTranslations } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { useSelector } from 'react-redux';

function AffiliateShow({ data }) {
    const { locale } = useI18n();

    const name =
        data.name_type === 'Personal'
            ? `${data.first_name[locale]} ${data.last_name[locale]}`
            : data.name[locale];
    return (
        <div className="base-data box">
            <p className="name">{name}</p>
        </div>
    );
}

export default AffiliateShow;
