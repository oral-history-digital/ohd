import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

/**
 * Reads localized missing-media text, falling back to the standard UI message.
 *
 * @returns {string} Project message or the translated default while unavailable.
 */
export function useGetMediaMissingText() {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({ include: ['playback'] });

    const customText = !isLoading && !error && project?.media_missing_text;

    if (typeof customText === 'string' && customText.trim().length > 0) {
        return customText;
    }
    return t('modules.media_player.media_missing');
}
