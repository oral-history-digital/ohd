import { useSelector } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { useI18n } from 'modules/i18n';

function MetadataFieldShow({data}) {
    const locale = useSelector(getLocale);
    const translations = useSelector(getTranslations);
    const { t } = useI18n();

    let name;
    if (translations[`search_facets.${data.name}`]) {
        name = t(`search_facets.${data.name}`);
    } else {
        name = data.label && data.label[locale];
    }

    return (
        <div className='base-data box'>
            <p className='name'>
                {name}
            </p>
        </div>
    );
}

export default MetadataFieldShow;
