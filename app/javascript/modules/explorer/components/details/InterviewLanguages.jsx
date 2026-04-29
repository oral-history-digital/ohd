import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export function InterviewLanguages({ languages }) {
    const { t, locale } = useI18n();

    if (!languages?.length) return null;

    const translatedLanguages = languages
        .map((languageCode) => t(languageCode))
        .sort((a, b) => a.localeCompare(b, locale))
        .join(', ');

    return (
        <div className="DescriptionList-group DescriptionList-group--interview-languages">
            <dt className="DescriptionList-term">
                {t('explorer.interview_languages')}
            </dt>
            <dd className="DescriptionList-description">
                {translatedLanguages}
            </dd>
        </div>
    );
}

InterviewLanguages.propTypes = {
    languages: PropTypes.arrayOf(PropTypes.string),
};

export default InterviewLanguages;
