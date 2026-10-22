import { fireEvent, render, screen } from '@testing-library/react';
import { t as originalT } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import UserFormContainer from './UserFormContainer';

jest.mock('modules/archive/actions', () => ({
    ...jest.requireActual('modules/archive/actions'),
    fetchTranslationsForLocale: () => () => Promise.resolve(),
}));
jest.mock('modules/routes/useProject', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
    t: jest.fn((_context, key, values = {}) =>
        key.startsWith('devise.mailer')
            ? [`Mail text for ${values.project_name}`]
            : 'Translated'
    ),
}));

const project = {
    id: 123,
    shortname: 'zwar',
    available_locales: ['de', 'en'],
    default_locale: 'de',
    archive_domain: 'https://example.org',
    name: 'Projekt DE',
    contact_email: 'contact@example.org',
    is_umbrella: true,
};
const data = {
    id: 4,
    first_name: 'Hans',
    last_name: 'Tester',
    default_locale: 'de',
    type: 'User',
    workflow_state: 'afirmed',
    workflow_states: ['block', 'remove'],
};
const mockStore = configureStore([thunk]);
let preview;

beforeEach(() => {
    jest.clearAllMocks();
    preview = { project };
    useProject.mockImplementation((options) =>
        options.include ? preview : { project }
    );
});

/**
 * Opens the user editor with current project settings and a recipient account.
 * @param {Object} [user=data] - Account fields to edit.
 * @returns {Object} Render controls.
 */
function renderUserForm(user = data) {
    return render(
        <Provider
            store={mockStore({
                data: {},
                archive: { locale: 'en', translations: {} },
            })}
        >
            <BrowserRouter>
                <UserFormContainer
                    data={user}
                    dataPath="/users.json"
                    userId={4}
                    scope="user"
                />
            </BrowserRouter>
        </Provider>
    );
}

test.each([
    ['de', 'de'],
    ['en', 'en'],
    ['es', 'de'],
])(
    'uses the allowed recipient locale or project default for %s',
    (defaultLocale, locale) => {
        renderUserForm({ ...data, default_locale: defaultLocale });
        expect(useProject).toHaveBeenCalledWith({
            locale,
            include: ['email_preview'],
        });
        expect(screen.getByTestId('user-form')).toBeInTheDocument();
        fireEvent.change(screen.getByTestId('user-workflow_state-select'), {
            target: { value: 'block' },
        });
        expect(screen.getByTestId('user-mail_text-textarea')).toHaveValue(
            'Mail text for Projekt DE'
        );
        expect(originalT).toHaveBeenLastCalledWith(
            expect.objectContaining({ locale }),
            'devise.mailer.block.text',
            expect.objectContaining({
                project_name: 'Projekt DE',
                tos_link: expect.stringContaining(
                    `https://example.org/${locale}/conditions`
                ),
                mail_to: expect.stringContaining('mailto:contact@example.org'),
                correct_link: expect.stringContaining(
                    `https://example.org/${locale}?correct_user_data=true`
                ),
            })
        );
    }
);

test('retains the originating project link and uses portal-prefixed policy URLs without a dedicated domain', () => {
    preview = { project: { ...project, archive_domain: null } };
    renderUserForm({
        ...data,
        pre_access_location: 'https://example.org/de/interviews/za001',
    });
    fireEvent.change(screen.getByTestId('user-workflow_state-select'), {
        target: { value: 'block' },
    });
    expect(originalT).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
            project_link: expect.stringContaining(
                'https://example.org/de/interviews/za001'
            ),
            tos_link: expect.stringContaining('/zwar/de/conditions'),
        })
    );
});

test('waits for authorized contact data and reports denial without showing the form', () => {
    preview = { isLoading: true };
    const { rerender } = renderUserForm();
    expect(screen.queryByTestId('user-form')).not.toBeInTheDocument();
    preview = { error: { message: 'Forbidden' } };
    rerender(
        <Provider
            store={mockStore({
                data: {},
                archive: { locale: 'en', translations: {} },
            })}
        >
            <BrowserRouter>
                <UserFormContainer
                    data={data}
                    dataPath="/users.json"
                    userId={4}
                    scope="user"
                />
            </BrowserRouter>
        </Provider>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Forbidden');
    expect(screen.queryByTestId('user-form')).not.toBeInTheDocument();
});

test('omits the contact link when the project has no contact address', () => {
    preview = { project: { ...project, contact_email: null } };
    renderUserForm();
    fireEvent.change(screen.getByTestId('user-workflow_state-select'), {
        target: { value: 'block' },
    });
    expect(originalT).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ mail_to: '' })
    );
});
