import { renderHook } from '@testing-library/react';
import {
    getLocale,
    getTranslations,
    getTranslationsView,
} from 'modules/archive';
import { useProject } from 'modules/routes';
import videojs from 'video.js';

import useVideojsLanguages from './useVideojsLanguages';

jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/archive', () => ({
    getLocale: jest.fn(),
    getTranslations: jest.fn(),
    getTranslationsView: jest.fn(),
}));
jest.mock('react-redux', () => ({ useSelector: (selector) => selector() }));
jest.mock('video.js', () => ({ addLanguage: jest.fn() }));
jest.mock('../constants', () => ({
    VIDEOJS_I18N_KEY_MAP: { Play: 'media_player.play' },
    VIDEOJS_PLUGIN_TRANSLATION_MAP: { skipBack: 'media_player.skip_backwards' },
}));

beforeEach(() => {
    jest.clearAllMocks();
    getLocale.mockReturnValue('en');
    getTranslations.mockReturnValue({
        'media_player.play': { en: 'Custom play' },
    });
    getTranslationsView.mockReturnValue(false);
    useProject.mockReturnValue({ project: { available_locales: ['en'] } });
});

test('registers project locales with UI overrides and preserves translation-key view', () => {
    const { result, rerender } = renderHook(() => useVideojsLanguages());
    expect(useProject).toHaveBeenCalledWith({});
    expect(result.current.strings.Play).toBe('Custom play');
    expect(videojs.addLanguage).toHaveBeenCalledWith(
        'en',
        expect.objectContaining({ Play: 'Custom play' })
    );
    getTranslationsView.mockReturnValue(true);
    rerender();
    expect(result.current.strings.Play).toBe('media_player.play');
    expect(result.current.pluginTranslations.skipBack).toBe(
        'media_player.skip_backwards'
    );
});

test('does not register languages while project settings load or access fails', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(() => useVideojsLanguages());
    expect(result.current).toBeNull();
    useProject.mockReturnValue({
        project: { available_locales: ['en'] },
        error: { message: 'Access denied' },
    });
    rerender();
    expect(result.current).toBeNull();
    expect(videojs.addLanguage).not.toHaveBeenCalled();
});
