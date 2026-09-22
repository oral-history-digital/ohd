import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Form from './Form';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));

const elements = [
    {
        attribute: 'file',
        elementType: 'fileInput',
        preview: 'image',
        currentFiles: {
            name: 'persisted.png',
            url: '/persisted.png',
            contentType: 'image/png',
        },
    },
];

function selectReplacement() {
    const replacement = new File(['replacement'], 'replacement.png', {
        type: 'image/png',
    });
    fireEvent.change(
        screen.getByLabelText('activerecord.attributes.logo.file', {
            selector: 'input',
        }),
        { target: { files: [replacement] } }
    );
    return replacement;
}

test('shows the persisted file after a successful submission', async () => {
    const onSubmit = jest.fn().mockResolvedValue({});
    render(<Form scope="logo" elements={elements} onSubmit={onSubmit} />);
    const replacement = selectReplacement();

    expect(screen.getByText('replacement.png')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'submit' }));

    await waitFor(() =>
        expect(screen.getByText('persisted.png')).toBeInTheDocument()
    );
    expect(screen.queryByText('replacement.png')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith(
        { logo: { file: replacement } },
        undefined
    );
});

test('keeps the selected file when submission fails', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('Upload failed'));
    render(<Form scope="logo" elements={elements} onSubmit={onSubmit} />);
    selectReplacement();

    fireEvent.click(screen.getByRole('button', { name: 'submit' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(screen.getByText('replacement.png')).toBeInTheDocument();
    expect(screen.queryByText('persisted.png')).not.toBeInTheDocument();
});

test('runs the completion callback synchronously for synchronous submissions', () => {
    const onSubmitCallback = jest.fn();
    render(
        <Form
            scope="logo"
            elements={[]}
            onSubmit={jest.fn()}
            onSubmitCallback={onSubmitCallback}
        />
    );

    fireEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(onSubmitCallback).toHaveBeenCalledTimes(1);
});

test('confirms submission before calling onSubmit', async () => {
    const onSubmit = jest.fn().mockResolvedValue({});
    render(
        <Form
            scope="setting"
            elements={[{ attribute: 'name' }]}
            values={{ name: 'Before' }}
            onSubmit={onSubmit}
            submitConfirmation={{
                title: 'Confirm change',
                message: 'This affects the website.',
                confirmText: 'Change',
            }}
        />
    );

    fireEvent.change(screen.getByTestId('setting-name-text-input'), {
        target: { value: 'After' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByRole('dialog')).toHaveTextContent(
        'This affects the website.'
    );
    fireEvent.click(screen.getByRole('button', { name: 'Change' }));

    await waitFor(() =>
        expect(onSubmit).toHaveBeenCalledWith(
            { setting: { name: 'After' } },
            undefined
        )
    );
    await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
});

test('keeps form dirty when confirmation is cancelled', async () => {
    const onSubmit = jest.fn();
    render(
        <Form
            scope="setting"
            elements={[{ attribute: 'name' }]}
            values={{ name: 'Before' }}
            onSubmit={onSubmit}
            disableIfUnchanged
            submitConfirmation={{
                title: 'Confirm change',
                message: 'Warning',
            }}
        />
    );
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(screen.getByTestId('setting-name-text-input'), {
        target: { value: 'After' },
    });
    fireEvent.click(submitButton);
    await screen.findByRole('dialog');
    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(submitButton).toBeEnabled();
});
