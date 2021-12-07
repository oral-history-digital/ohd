import { PROJECT_ZWAR, PROJECT_CDOH, PROJECT_MOG } from 'modules/constants';

export default function showTranslationTab(projectId, interviewLang, locale) {
    if (typeof projectId !== 'string') {
        throw new TypeError('projectId must be string');
    }
    if (typeof interviewLang !== 'string') {
        throw new TypeError('interviewLang must be string');
    }
    if (typeof locale !== 'string') {
        throw new TypeError('locale must be string');
    }

    switch (projectId) {
    case PROJECT_CDOH:
        return interviewLang !== locale;
    case PROJECT_ZWAR:
        return interviewLang !== 'de';
    //case PROJECT_MOG:
    default:
        return interviewLang !== locale;
    }
}
