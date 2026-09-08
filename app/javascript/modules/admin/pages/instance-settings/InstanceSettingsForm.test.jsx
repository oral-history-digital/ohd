import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import InstanceSettingsForm from './InstanceSettingsForm';

const mockT = jest.fn((key) => key);

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: mockT }),
}));

beforeEach(() => mockT.mockClear());

const projects = [
    { id: 1, name: { en: 'OHD' }, shortname: 'ohd' },
    { id: 2, name: { en: 'Archive Two' }, shortname: 'archive-two' },
    {
        id: 3,
        name: { de: 'Archiv Drei' },
        shortname: 'archive-three',
        default_locale: 'de',
    },
];

function renderForm(props = {}) {
    const onSubmit = jest.fn().mockResolvedValue({});

    render(
        <InstanceSettingsForm
            instanceSettings={{ umbrella_project_id: 1 }}
            notification={null}
            onDismissNotification={jest.fn()}
            onSubmit={onSubmit}
            projects={projects}
            {...props}
        />
    );

    return onSubmit;
}

test('shows existing projects and selects the configured umbrella project', () => {
    renderForm();

    const select = screen.getByRole('combobox', {
        name: 'edit.instance.umbrella_project_id',
    });

    expect(select).toHaveValue('1');
    expect(
        screen.getByRole('option', { name: 'OHD (ohd)' })
    ).toBeInTheDocument();
    expect(
        screen.getByRole('option', {
            name: 'Archive Two (archive-two)',
        })
    ).toBeInTheDocument();
    expect(
        screen.getByRole('option', {
            name: 'Archiv Drei (archive-three)',
        })
    ).toBeInTheDocument();
    expect(
        screen.getByTestId('homepage_setting-umbrella_project_id-help-text')
    ).toHaveTextContent('edit.instance.umbrella_project_help');
    expect(
        mockT.mock.calls.filter(
            ([key]) => key === 'edit.instance.umbrella_project_help'
        )
    ).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
});

test('disables submit again when selection returns to configured project', () => {
    renderForm();
    const select = screen.getByRole('combobox', {
        name: 'edit.instance.umbrella_project_id',
    });
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(select, { target: { value: '2' } });
    expect(submitButton).toBeEnabled();
    fireEvent.change(select, { target: { value: '1' } });

    expect(submitButton).toBeDisabled();
});

test('requires confirmation before submitting a changed umbrella project', async () => {
    const onSubmit = renderForm();
    const select = screen.getByRole('combobox', {
        name: 'edit.instance.umbrella_project_id',
    });

    fireEvent.change(select, { target: { value: '2' } });
    const submitButton = screen.getByRole('button', { name: 'submit' });
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByRole('dialog')).toHaveTextContent(
        'edit.instance.umbrella_project_confirm.warning'
    );

    fireEvent.click(
        screen.getByRole('button', {
            name: 'edit.instance.umbrella_project_confirm.submit',
        })
    );

    await waitFor(() =>
        expect(onSubmit).toHaveBeenCalledWith(
            { homepage_setting: { umbrella_project_id: '2' } },
            undefined
        )
    );
    await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
});

test('cancelling confirmation does not submit the change', async () => {
    const onSubmit = renderForm();

    fireEvent.change(
        screen.getByRole('combobox', {
            name: 'edit.instance.umbrella_project_id',
        }),
        { target: { value: '2' } }
    );
    fireEvent.click(screen.getByRole('button', { name: 'submit' }));
    await screen.findByRole('dialog');
    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
