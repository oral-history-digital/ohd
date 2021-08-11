import { PROJECT_ZWAR, PROJECT_CDOH, PROJECT_MOG } from 'modules/constants';

export default function showTranslationTab(projectId, interviewLang, locale) {
    switch (projectId) {
    case PROJECT_CDOH:
        return interviewLang === locale;
    case PROJECT_ZWAR:
        return interviewLang === 'de';
    case PROJECT_MOG:
    default:
        return true;
    }
}
