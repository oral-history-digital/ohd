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

import UploadTranscript from './UploadTranscript';

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

beforeEach(() => {
    window.fetch = jest.fn().mockResolvedValue({
        status: 200,
        json: async () => ({ valid: true, issues: [] }),
    });
});

/**
 * Opens the real modal and supplies required form fields.
 * @param {Function} submitData - Redux mutation callback.
 * @returns {HTMLElement} Import dialog.
 */
function openForm(submitData) {
    submitDataAction.mockImplementation((...args) => {
        submitData(...args);
        return { type: 'QUEUE_TRANSCRIPT' };
    });
    const state = {
        archive: { archiveId: 'adg001' },
        data: {
            interviews: {
                adg001: { contributions: {}, primary_language_id: 1 },
            },
            languages: { 1: { id: 1, name: 'German' } },
        },
    };
    const store = createStore(() => state);
    render(
        <Provider store={store}>
            <UploadTranscript />
        </Provider>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
        screen.getAllByRole('link', {
            name: 'transcript_template',
            hidden: true,
        })
    ).toHaveLength(1);
    fireEvent.click(
        screen.getByRole('button', { name: 'edit.upload_transcript.title' })
    );
    const dialog = screen.getByRole('dialog');
    expect(
        screen.getAllByRole('link', {
            name: 'transcript_template',
            hidden: true,
        })
    ).toHaveLength(2);
    fireEvent.change(
        within(dialog).getByLabelText(
            /activerecord.attributes.transcript.data/,
            { selector: 'input' }
        ),
        {
            target: { files: [new File(['text'], 'transcript.csv')] },
        }
    );
    fireEvent.change(
        within(dialog).getByLabelText(
            /activerecord.attributes.transcript.transcript_language_id/,
            { selector: 'select' }
        ),
        { target: { value: '1' } }
    );
    fireEvent.change(
        within(dialog).getByLabelText(
            /activerecord.attributes.transcript.tape_number/,
            { selector: 'input' }
        ),
        { target: { value: '1' } }
    );
    return dialog;
}

test('submit checks first and queues automatically after a valid response', async () => {
    const submitData = jest.fn();
    const dialog = openForm(submitData);
    const submit = within(dialog).getByRole('button', {
        name: 'edit.upload_transcript.title',
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(submit).toBeEnabled();
    fireEvent.click(submit);
    expect(submit).toBeDisabled();
    await waitFor(() => expect(submitData).toHaveBeenCalledTimes(1));
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/adg/de' },
        {
            transcript: expect.objectContaining({
                archive_id: 'adg001',
                tape_number: '1',
                transcript_language_id: '1',
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
        within(dialog).queryByRole('link', { name: 'transcript_template' })
    ).not.toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
        screen.getByRole('button', { name: 'edit.upload_transcript.title' })
    ).toHaveClass('GenericButton--contained');
});

test('submit displays issues in InlineNotification and editing clears them without a request', async () => {
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
        name: 'edit.upload_transcript.title',
    });
    fireEvent.click(submit);
    expect(
        await screen.findByText(
            'import_validation.timecode.minutes_out_of_range'
        )
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('InlineNotification--error');
    expect(submitData).not.toHaveBeenCalled();
    fireEvent.click(
        within(dialog).getByLabelText(
            'activerecord.attributes.transcript.delete_existing',
            { selector: 'input' }
        )
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    fireEvent.click(submit);
    await waitFor(() => expect(submitData).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledTimes(2);
});

test('keeps the form on queue request failure and resets after closing', async () => {
    const submitData = jest.fn();
    const dialog = openForm(submitData);
    fireEvent.click(
        within(dialog).getByRole('button', {
            name: 'edit.upload_transcript.title',
        })
    );
    await waitFor(() => expect(submitData).toHaveBeenCalledTimes(1));
    await act(async () => submitData.mock.calls[0][2].onError({}));
    expect(
        screen.getByText('import_validation.import_failed')
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('InlineNotification--error');
    expect(within(dialog).getByTestId('transcript-form')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(
        screen.getByRole('button', { name: 'edit.upload_transcript.title' })
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
        within(screen.getByRole('dialog')).getByLabelText(
            /activerecord.attributes.transcript.data/,
            { selector: 'input' }
        ).files
    ).toHaveLength(0);
});

test('shows checking and prevents duplicate submissions while validation is pending', async () => {
    let finish;
    fetch.mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                finish = resolve;
            })
    );
    const submitData = jest.fn();
    const dialog = openForm(submitData);
    fireEvent.click(
        within(dialog).getByRole('button', {
            name: 'edit.upload_transcript.title',
        })
    );
    expect(screen.getByText('import_validation.checking')).toBeInTheDocument();
    fireEvent.submit(within(dialog).getByTestId('transcript-form'));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(submitData).not.toHaveBeenCalled();
    await act(async () =>
        finish({ status: 200, json: async () => ({ valid: true, issues: [] }) })
    );
    expect(submitData).toHaveBeenCalledTimes(1);
});
