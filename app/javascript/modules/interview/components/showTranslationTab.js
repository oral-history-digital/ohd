import { PROJECT_ZWAR, PROJECT_CDOH } from 'modules/constants';

export default function showTranslationTab(project, interview, locale) {
    return projectSupportsTranslatedTranscript(project, interview, locale)
        && translationAvailable(interview);
}

function projectSupportsTranslatedTranscript(project, interview, locale) {
    switch (project.shortname) {
    case PROJECT_CDOH:
        return interview.alpha2 !== locale;
    case PROJECT_ZWAR:
        return interview.alpha2 !== 'de';
    default:
        return interview.alpha2 !== locale;
    }
}

function translationAvailable(interview) {
    return interview?.alpha3s_with_transcript.includes(interview.translation_locale);
}
