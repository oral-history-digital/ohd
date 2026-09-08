import { fireEvent, render, screen } from '@testing-library/react';

import InstanceSettingsForm from './InstanceSettingsForm';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));

const projects = [
    { id: 1, name: { en: 'OHD' }, shortname: 'ohd' },
    { id: 2, name: { en: 'Archive Two' }, shortname: 'archive-two' },
];

function renderForm(props = {}) {
    const onSubmit = jest.fn();

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
    expect(screen.getByRole('option', { name: 'OHD' })).toBeInTheDocument();
    expect(
        screen.getByRole('option', { name: 'Archive Two' })
    ).toBeInTheDocument();
});

test('submits selected project id as umbrella project', () => {
    const onSubmit = renderForm();
    const select = screen.getByRole('combobox', {
        name: 'edit.instance.umbrella_project_id',
    });

    fireEvent.change(select, { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
        { homepage_setting: { umbrella_project_id: '2' } },
        undefined
    );
});
