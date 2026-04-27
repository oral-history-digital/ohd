import { getLocale, getTranslations } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { useSelector } from 'react-redux';

function AffiliateShow({ data }) {
    const name =
        data.name_type === 'Personal'
            ? `${data.first_name} ${data.last_name}`
            : data.name;
    return (
        <div className="base-data box">
            <p className="name">{name}</p>
        </div>
    );
}

export default AffiliateShow;
