/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'modules/forms';
import { useProject } from 'modules/routes';

import CorrectUserDataForm from './CorrectUserDataForm';
import RequestProjectAccessForm from './RequestProjectAccessForm';

let mockLocale = 'de';

jest.mock('modules/routes', () => ({
    pathBase: jest.requireActual('modules/routes/pathBase').default,
    useProject: jest.fn(),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        locale: mockLocale,
        t: (key, params) =>
            key === 'user.notes_on_tos_agreement_archive' ? (
                <span>
                    {params.project}
                    {params.tos_link}
                </span>
            ) : params?.project ? (
                `${key}: ${params.project}`
            ) : (
                key
            ),
    }),
}));
jest.mock('modules/forms', () => ({
    Form: jest.fn(({ onSubmit }) => (
        <button
            onClick={() =>
                onSubmit({ user_project: { id: 4, organization: 'Institute' } })
            }
        >
            Submit
        </button>
    )),
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));

const forms = [
    ['request', RequestProjectAccessForm, 'https://archive.example.org', 'en'],
    ['correction', CorrectUserDataForm, null, 'de'],
];
const userProject = { id: 4, project_id: 7, research_intentions: 'film' };
const currentUser = {
    id: 2,
    organization: 'Institute',
    user_projects: { 4: userProject },
};

/**
 * Supplies the existing mutation callbacks and account values to either form.
 *
 * @returns {Object} Form props with independent submission spies.
 */
function props() {
    return {
        projectId: 'pilot',
        currentUser,
        userProject,
        countryKeys: { de: ['DE'] },
        submitData: jest.fn(),
        onSubmit: jest.fn(),
        onCancel: jest.fn(),
    };
}

/**
 * Provides the public settings used by both forms without any editing identifiers.
 *
 * @param {?string} archiveDomain - Dedicated project domain, or null for umbrella routing.
 * @returns {Object} Project display response with localized strings and booleans.
 */
function displayProject(archiveDomain) {
    return {
        id: 7,
        shortname: 'pilot',
        name: 'Localized name',
        archive_domain: archiveDomain,
        has_newsletter: true,
        access_config: {
            organization: { display: true, obligatory: true },
            job_description: {
                display: true,
                obligatory: false,
                values: { researcher: true, filmmaker: false },
            },
            research_intentions: {
                display: true,
                obligatory: true,
                values: { film: true, art: false },
            },
            specification: { display: false, obligatory: false },
            tos_agreement: { display: true, obligatory: true },
        },
    };
}

beforeEach(() => {
    jest.clearAllMocks();
    mockLocale = 'de';
    useProject.mockReturnValue({ projectDbId: 7, isLoading: true });
});

test.each(forms)(
    '%s waits for configuration and retains fields, links, and submission behavior',
    (name, Component, domain, locale) => {
        mockLocale = locale;
        const formProps = props();
        const { rerender } = render(<Component {...formProps} />);
        expect(screen.getByRole('status')).toHaveTextContent('Loading');
        expect(Form).not.toHaveBeenCalled();
        expect(useProject).toHaveBeenCalledWith({
            include: ['access_config'],
        });
        const project = displayProject(domain);
        useProject.mockReturnValue({
            projectDbId: 7,
            project,
            isLoading: false,
        });
        rerender(<Component {...formProps} />);
        const { elements, values, data } = Form.mock.lastCall[0];
        const field = (attribute) =>
            elements.find((element) => element.attribute === attribute);
        expect(field('organization').value).toBe('Institute');
        expect(field('organization').validate('')).toBe(false);
        expect(field('organization').validate('Institute')).toBe(true);
        expect(field('job_description').values).toEqual(['researcher']);
        expect(field('research_intentions').values).toEqual(['film']);
        expect(field('specification')).toBeUndefined();
        expect(data).toBe(userProject);
        expect(values.workflow_state).toBe(
            name === 'request'
                ? 'request_project_access'
                : 'correct_project_access_data'
        );
        expect(screen.queryByRole('heading')?.textContent).toBe(
            name === 'request'
                ? 'modules.project_access.request_title: Localized name'
                : undefined
        );
        expect(field('receive_newsletter')?.help).toBe(
            name === 'request'
                ? 'user_project.notes_on_receive_newsletter: Localized name'
                : undefined
        );
        expect(values).toMatchObject(
            name === 'request'
                ? {
                      project_id: 7,
                      user_id: 2,
                      pre_access_location: location.href,
                  }
                : {}
        );
        render(field('tos_agreement').help);
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            domain
                ? `${domain}/${locale}/conditions`
                : `/pilot/${locale}/conditions`
        );
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        expect(formProps.submitData).toHaveBeenCalledWith(
            { locale, projectId: 'pilot', project },
            { user_project: { id: 4, organization: 'Institute' } }
        );
        expect(formProps.onSubmit).toHaveBeenCalledTimes(1);
        useProject.mockReturnValue({
            projectDbId: 7,
            project,
            isLoading: false,
            isValidating: true,
        });
        rerender(<Component {...formProps} />);
        expect(Form.mock.lastCall[0].fetching).toBe(true);
    }
);

test.each(forms)(
    '%s blocks submission after denied reads or missing configuration',
    (_name, Component) => {
        const formProps = props();
        const { rerender } = render(<Component {...formProps} />);
        useProject.mockReturnValue({
            projectDbId: 7,
            isLoading: false,
            error: { status: 403, message: 'Access denied.' },
        });
        rerender(<Component {...formProps} />);
        expect(screen.getByRole('alert')).toHaveTextContent('Access denied.');
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        useProject.mockReturnValue({
            projectDbId: 7,
            isLoading: false,
            project: { id: 7, access_config: null },
        });
        rerender(<Component {...formProps} />);
        expect(screen.getByRole('alert')).toHaveClass(
            'InlineNotification--error'
        );
        expect(Form).not.toHaveBeenCalled();
        expect(formProps.submitData).not.toHaveBeenCalled();
    }
);
