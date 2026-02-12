import { useI18n } from 'modules/i18n';

export function useProjectTranslation(project) {
    const { locale } = useI18n();

    return project.translations_attributes?.find(
        (translation) => translation.locale === locale
    );
}
