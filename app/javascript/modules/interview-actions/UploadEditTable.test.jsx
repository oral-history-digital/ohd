import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from '@testing-library/react';
import { submitData as submitDataAction } from 'modules/data';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import UploadEditTable from './UploadEditTable';

jest.mock('modules/data', () => ({
    getCurrentInterview: (state) =>
        state.data.interviews[state.archive.archiveId],
    getLanguages: (state) => state.data.languages,
    getMarkTextStatus: (state) => state.data.statuses.mark_text,
    submitData: jest.fn(),
}));
jest.mock('modules/routes', () => ({ usePathBase: () => '/adg/de' }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de', t: (key) => key }),
}));
jest.mock('modules/person', () => ({ usePeople: () => ({ data: {} }) }));
jest.mock('./hooks/useImportSpeakers', () => ({
    useImportSpeakers: () => ({
        options: null,
        isLoading: false,
        error: false,
    }),
}));

beforeEach(() => {
    window.fetch = jest.fn().mockResolvedValue({
        status: 200,
        json: async () => ({ valid: true, issues: [] }),
    });
});

/**
 * Opens the edit-table import modal and selects a CSV file.
 * @param {Function} submitData - Captures the Redux mutation arguments.
 * @returns {HTMLElement} Import dialog.
 */
function openForm(submitData) {
    submitDataAction.mockImplementation((...args) => {
        submitData(...args);
        return { type: 'QUEUE_EDIT_TABLE' };
    });
    const state = {
        archive: { archiveId: 'adg001' },
        data: { interviews: { adg001: { contributions: {} } } },
    };
    render(
        <Provider store={createStore(() => state)}>
            <UploadEditTable />
        </Provider>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const template = screen.getByRole('link', {
        name: 'edit.upload_edit_table.template',
    });
    expect(template).toHaveAttribute(
        'href',
        '/adg/de/edit-table-import-template.csv?id=adg001&locale=de'
    );
    fireEvent.click(
        screen.getByRole('button', { name: 'edit.upload_edit_table.title' })
    );
    const dialog = screen.getByRole('dialog');
    const input = within(dialog).getByLabelText(
        /activerecord.attributes.edit_table.data/,
        { selector: 'input' }
    );
    expect(input).toHaveAttribute('accept', '.csv');
    fireEvent.change(input, {
        target: { files: [new File(['text'], 'edit-table.csv')] },
    });
    return dialog;
}

test('checks the CSV and switch values before queueing and shows modal success', async () => {
    const submitData = jest.fn();
    const dialog = openForm(submitData);
    expect(
        within(dialog).getByRole('link', {
            name: 'edit.upload_edit_table.template',
        })
    ).toBeInTheDocument();
    fireEvent.click(
        within(dialog).getByRole('switch', {
            name: 'activerecord.attributes.edit_table.only_references',
        })
    );
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(
        within(dialog).getByRole('button', {
            name: 'edit.upload_edit_table.title',
        })
    );
    await waitFor(() => expect(submitData).toHaveBeenCalledTimes(1));
    expect(fetch.mock.calls[0][0]).toBe('/adg/de/edit_tables/validate');
    expect(fetch.mock.calls[0][1].body.get('edit_table[archive_id]')).toBe(
        'adg001'
    );
    expect(fetch.mock.calls[0][1].body.get('edit_table[only_references]')).toBe(
        'true'
    );
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/adg/de' },
        {
            edit_table: expect.objectContaining({
                archive_id: 'adg001',
                data: expect.any(File),
                only_references: true,
            }),
        },
        expect.any(Object),
        expect.any(Function)
    );
    expect(
        screen.queryByText('import_validation.queued')
    ).not.toBeInTheDocument();
    await act(async () => submitData.mock.calls[0][3]());
    expect(screen.getByRole('status')).toHaveClass(
        'InlineNotification--success'
    );
    expect(
        screen.getByText('import_validation.queued_hint')
    ).toBeInTheDocument();
    expect(
        within(dialog).queryByRole('link', {
            name: 'edit.upload_edit_table.template',
        })
    ).not.toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
        screen.getByRole('button', { name: 'edit.upload_edit_table.title' })
    ).toHaveClass('GenericButton--contained');
});

test('shows validation issues, clears them on edits, and retries on submit', async () => {
    const submitData = jest.fn();
    const dialog = openForm(submitData);
    fetch.mockResolvedValueOnce({
        status: 422,
        json: async () => ({
            valid: false,
            issues: [
                {
                    code: 'timecode.minutes_out_of_range',
                    params: {},
                    location: {},
                },
            ],
        }),
    });
    const submit = within(dialog).getByRole('button', {
        name: 'edit.upload_edit_table.title',
    });
    fireEvent.click(submit);
    expect(
        await screen.findByText(
            'import_validation.timecode.minutes_out_of_range'
        )
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('InlineNotification--error');
    expect(submitData).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole('switch'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    fireEvent.click(submit);
    await waitFor(() => expect(submitData).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledTimes(2);
});

test('keeps the form after a queue error and resets it when reopened', async () => {
    const submitData = jest.fn();
    const dialog = openForm(submitData);
    fireEvent.click(
        within(dialog).getByRole('button', {
            name: 'edit.upload_edit_table.title',
        })
    );
    await waitFor(() => expect(submitData).toHaveBeenCalledTimes(1));
    await act(async () => submitData.mock.calls[0][2].onError({}));
    expect(
        screen.getByText('import_validation.import_failed')
    ).toBeInTheDocument();
    expect(within(dialog).getByTestId('edit_table-form')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'cancel' }));
    fireEvent.click(
        screen.getByRole('button', { name: 'edit.upload_edit_table.title' })
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
        screen.getByLabelText(/activerecord.attributes.edit_table.data/, {
            selector: 'input',
        }).files
    ).toHaveLength(0);
});

test('blocks duplicate submissions and cancels obsolete checks when closed', async () => {
    const submitData = jest.fn();
    const dialog = openForm(submitData);
    let finish;
    fetch.mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                finish = resolve;
            })
    );
    const submit = within(dialog).getByRole('button', {
        name: 'edit.upload_edit_table.title',
    });
    fireEvent.click(submit);
    expect(submit).toBeDisabled();
    fireEvent.submit(within(dialog).getByTestId('edit_table-form'));
    expect(fetch).toHaveBeenCalledTimes(1);
    const signal = fetch.mock.calls[0][1].signal;
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27 });
    expect(signal.aborted).toBe(true);
    await act(async () =>
        finish({
            status: 200,
            json: async () => ({ valid: true, issues: [] }),
        })
    );
    expect(submitData).not.toHaveBeenCalled();
});
