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
        t: (key, values = {}) => {
            if (key === 'user.registration_text_umbrella') {
                return [
                    `Use ${values.umbrella_project_name}: `,
                    values.conditions_link,
                    ' and ',
                    values.privacy_link,
                    '. Request archive access.',
                ];
            }

            if (key === 'user.registration_text_project') {
                return [
                    'Access interviews: ',
                    values.conditions_link,
                    ' and ',
                    values.privacy_link,
                    '.',
                ];
            }

            return key;
        },
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

function renderRegisterForm(isUmbrella) {
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockImplementation((selector) =>
        selector({
            countryKeys: {},
            project: { is_umbrella: isUmbrella },
            umbrellaProject: {
                display_shortname: 'tp.d',
                name: { en: 'Test-Portal.Digital' },
            },
            user: { registrationStatus: null },
        })
    );

    return render(<RegisterForm />);
}

test('renders the complete umbrella registration text with its links', () => {
    renderRegisterForm(true);

    expect(
        screen.getByText(
            (_, element) =>
                element?.tagName === 'P' &&
                element.textContent.includes('Use Test-Portal.Digital (tp.d)')
        )
    ).toBeInTheDocument();
    expect(
        screen.getByRole('link', { name: /^user\.tos_agreement/ })
    ).toHaveAttribute('href', 'https://portal.example/en/conditions');
    expect(
        screen.getByRole('link', { name: /^user\.priv_agreement_alias/ })
    ).toHaveAttribute('href', 'https://portal.example/en/privacy_protection');
});

test('renders the project registration text without the umbrella-only follow-up', () => {
    renderRegisterForm(false);

    expect(screen.getByText(/Access interviews:/)).toBeInTheDocument();
    expect(
        screen.queryByText(/Request archive access/)
    ).not.toBeInTheDocument();
});
