import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import UserForm from './UserForm';

const middlewares = [thunk];

// Mock the translation fetching to avoid network errors in tests
jest.mock('modules/archive/actions', () => {
    const actual = jest.requireActual('modules/archive/actions');
    return {
        ...actual,
        fetchTranslationsForLocale: () => (dispatch) => {
            dispatch({
                type: 'MERGE_TRANSLATIONS',
                translations: {},
            });
        },
    };
});

// Mock the i18n module so the component can call useI18n() and original t
// without needing the full translations fixture. This mock returns a
// simple `t` implementation and a locale. For mailer keys we return an
// array (the component calls .join('') on mailer translations).
jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        t: (key) =>
            key && key.startsWith('devise.mailer')
                ? ['Mail text']
                : 'Translated',
        locale: 'de',
    }),
    t: (opts, key) =>
        key && key.startsWith('devise.mailer') ? ['Mail text'] : 'Translated',
}));

describe('<UserForm />', () => {
    const initialState = {
        data: {},
        archive: {
            locale: 'en',
        },
    };
    const mockStore = configureStore(middlewares);

    const data = {
        access_token: null,
        admin: null,
        appellation: null,
        city: 'Kairo',
        confirmed_at: 1624392054000,
        country: 'Ägypten',
        created_at: '22.06.2021',
        default_locale: 'de',
        email: 'test@web.de',
        first_name: 'Hans',
        last_name: 'Tester',
        gender: 'male',
        id: 456116,
        job_description: null,
        organization: null,
        pre_register_location: null,
        priv_agreement: true,
        processed_at: '22.06.2021',
        research_intentions: null,
        specification: 'alsjd lkajsdlkja sldkjal ksdj laksjdl',
        state: null,
        street: 'Heinrichstr. 1',
        tos_agreement: true,
        translations_attributes: [],
        type: 'User',
        user_id: 456116,
        user_projects: {
            id: 1,
            project_id: 1,
            user_id: 456116,
            workflow_state: '',
            workflow_states: '',
            mail_text: '',
            receive_newsletter: '',
            appellation: '',
            first_name: '',
            last_name: '',
            street: '',
            zipcode: '',
            city: '',
            country: '',
            job_description: '',
            research_intentions: '',
            specification: '',
            organization: '',
            pre_register_location: '',
            activated_at: '',
            processed_at: '',
            terminated_at: '',
            updated_at: '',
            created_at: '',
        },
        user_roles: {},
        workflow_state: 'afirmed',
        workflow_states: ['block', 'remove'],
        zipcode: '87979',
    };

    const dataPath = 'path/to/data';
    const userId = 123;
    const scope = 'scope';
    const locale = 'en';
    const project = {
        id: 123,
        shortname: 'zwar',
        available_locales: ['de', 'en'],
        default_locale: 'de',
        domain_with_optional_identifier: 'https://example.org',
        name: { de: 'Projekt DE', en: 'Project EN' },
        contact_email: 'contact@example.org',
        is_ohd: false,
        external_links: {
            1: {
                id: 1,
                name: { de: 'Test Link', en: 'Test Link' },
                url: { de: 'https://test.de', en: 'https://test.de' },
            },
        },
    };

    const onSubmit = jest.fn();

    const renderUserForm = () =>
        render(
            <Provider store={mockStore(initialState)}>
                <BrowserRouter>
                    <UserForm
                        data={data}
                        dataPath={dataPath}
                        userId={userId}
                        scope={scope}
                        locale={locale}
                        project={project}
                        onSubmit={onSubmit}
                    />
                </BrowserRouter>
            </Provider>
        );

    it('renders a form with the correct elements', () => {
        renderUserForm();

        expect(screen.getByTestId('scope-form')).toBeInTheDocument();
        expect(
            screen.getByTestId('scope-workflow_state-select')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('scope-mail_text-textarea')
        ).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });
});
