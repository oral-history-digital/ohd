import { render, screen } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';

import RegisterForm from './RegisterForm';

jest.mock('modules/archive', () => ({
    getCountryKeys: (state) => state.countryKeys,
}));
jest.mock('modules/constants', () => ({
    EMAIL_REGEX: /@/,
    OHD_DOMAINS: { test: 'https://portal.example' },
    PASSWORD_REGEX: /./,
}));
jest.mock('modules/data', () => ({
    getCurrentProject: (state) => state.project,
    getProjectBrandName: (project, locale) =>
        project.display_shortname
            ? `${project.name[locale]} (${project.display_shortname})`
            : project.name[locale],
    getUmbrellaProject: (state) => state.umbrellaProject,
}));
jest.mock('modules/forms', () => ({
    Form: () => null,
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        locale: 'en',
        t: (key, values) =>
            key === 'user.registration_text_two'
                ? `Use of ${values.umbrella_project_name}`
                : key,
    }),
}));
jest.mock('modules/query-string', () => ({
    sanitizeInternalReturnPath: () => null,
}));
jest.mock('modules/routes', () => ({
    usePathBase: () => '/en',
}));
jest.mock('modules/utils', () => ({
    sanitizeHtml: (value) => value,
}));
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

beforeAll(() => {
    globalThis.railsMode = 'test';
});

beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockImplementation((selector) =>
        selector({
            countryKeys: {},
            project: { is_umbrella: true },
            umbrellaProject: {
                display_shortname: 'tp.d',
                name: { en: 'Test-Portal.Digital' },
            },
            user: { registrationStatus: null },
        })
    );
});

test('interpolates the umbrella project name in registration text', () => {
    render(<RegisterForm />);

    expect(
        screen.getByText(
            (_, element) =>
                element?.tagName === 'P' &&
                element.textContent.includes(
                    'Use of Test-Portal.Digital (tp.d)'
                )
        )
    ).toBeInTheDocument();
});
