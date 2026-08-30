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
