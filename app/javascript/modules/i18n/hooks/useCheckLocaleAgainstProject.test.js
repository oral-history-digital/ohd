import { renderHook, waitFor } from '@testing-library/react';
import { fetchTranslationsForLocale, setLocale } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCheckLocaleAgainstProject } from './useCheckLocaleAgainstProject';

jest.mock('modules/archive', () => ({
    setLocale: jest.fn((locale) => ({ type: 'SET_LOCALE', locale })),
    fetchTranslationsForLocale: jest.fn(() => ({ type: 'FETCH_TRANSLATIONS' })),
}));
jest.mock('modules/i18n', () => ({ useI18n: jest.fn() }));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    pathBase: ({ project, projectId, locale }) =>
        project.archive_domain ? `/${locale}` : `/${projectId}/${locale}`,
}));
jest.mock('react-redux', () => ({ useDispatch: jest.fn() }));
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

const dispatch = jest.fn(() => Promise.resolve());
const navigate = jest.fn();
const project = {
    available_locales: ['en'],
    default_locale: 'en',
    archive_domain: 'https://archive.example',
};

beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReturnValue(navigate);
    useI18n.mockReturnValue({ locale: 'en' });
    useProject.mockReturnValue({ project, projectId: 'test' });
    useLocation.mockReturnValue({ pathname: '/de/register', search: '' });
});

test.each([
    '/de/register',
    '/de/register/',
    '/test/de/register',
    '/de/users/confirmation',
    '/de/users/password/new',
    '/de/conditions',
    '/de/privacy_protection',
])(
    'preserves the UI locale on %s despite project locale restrictions',
    (pathname) => {
        useLocation.mockReturnValue({
            pathname,
            search: '?confirmation_token=test',
        });

        renderHook(() => useCheckLocaleAgainstProject());

        expect(setLocale).toHaveBeenCalledWith('de');
        expect(navigate).not.toHaveBeenCalled();
        expect(fetchTranslationsForLocale).not.toHaveBeenCalled();
    }
);

test('keeps the registration locale when project summaries arrive after the first render', () => {
    useProject.mockReturnValue({ project: undefined });
    const { rerender } = renderHook(() => useCheckLocaleAgainstProject());
    expect(dispatch).not.toHaveBeenCalled();

    useProject.mockReturnValue({ project, projectId: 'test' });
    rerender();

    expect(setLocale).toHaveBeenCalledWith('de');
    expect(navigate).not.toHaveBeenCalled();
});

test('still redirects project content to its supported locale and preserves the query', async () => {
    useLocation.mockReturnValue({
        pathname: '/de/searches/archive',
        search: '?sort=random',
    });

    renderHook(() => useCheckLocaleAgainstProject());

    expect(fetchTranslationsForLocale).toHaveBeenCalledWith('en', '/en');
    await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith(
            '/en/searches/archive?sort=random',
            { replace: true }
        )
    );
});
