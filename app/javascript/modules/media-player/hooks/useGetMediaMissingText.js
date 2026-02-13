import { useI18n, useProjectTranslation } from 'modules/i18n';
import { useProject } from 'modules/routes';

export function useGetMediaMissingText() {
    const { t } = useI18n();
    const { project } = useProject();
    const translation = useProjectTranslation(project);

    const customText = translation?.media_missing_text;

    if (typeof customText === 'string' && customText.trim().length > 0) {
        return customText;
    }
    return t('modules.media_player.media_missing');
}
