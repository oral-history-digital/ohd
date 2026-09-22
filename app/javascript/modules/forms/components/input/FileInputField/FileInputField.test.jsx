import { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import FileInputField from './FileInputField';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));

function MultipleFileField() {
    const [files, setFiles] = useState([]);

    return (
        <FileInputField
            id="documents"
            name="documents"
            label="Documents"
            value={files}
            multiple
            maxFiles={2}
            onChange={setFiles}
        />
    );
}

test('returns a selected file in single-file mode', () => {
    const onChange = jest.fn();
    render(
        <FileInputField
            id="document"
            name="document"
            label="Document"
            accept="application/pdf"
            onChange={onChange}
        />
    );
    const file = new File(['document'], 'document.pdf', {
        type: 'application/pdf',
    });

    fireEvent.change(screen.getByLabelText('Document'), {
        target: { files: [file] },
    });

    expect(onChange).toHaveBeenCalledWith(file);
});

test('opens the native picker from the styled choose button', () => {
    render(
        <FileInputField
            id="document"
            name="document"
            label="Document"
            onChange={jest.fn()}
        />
    );
    const input = screen.getByLabelText('Document', { selector: 'input' });
    const clickSpy = jest.spyOn(input, 'click');

    fireEvent.click(screen.getByRole('button', { name: 'file_input.choose' }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
});

test('shows validation errors without returning an invalid file', () => {
    const onChange = jest.fn();
    render(
        <FileInputField
            id="document"
            name="document"
            label="Document"
            accept="application/pdf"
            onChange={onChange}
        />
    );
    const file = new File(['image'], 'image.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText('Document'), {
        target: { files: [file] },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
        'file_input.errors.invalid_type'
    );
});

test('supports multiple files and discarding individual selections', () => {
    render(<MultipleFileField />);
    const input = screen.getByLabelText('Documents');
    const first = new File(['first'], 'first.pdf', {
        type: 'application/pdf',
    });
    const second = new File(['second'], 'second.pdf', {
        type: 'application/pdf',
    });

    fireEvent.change(input, { target: { files: [first, second] } });

    expect(screen.getByText('first.pdf')).toBeInTheDocument();
    expect(screen.getByText('second.pdf')).toBeInTheDocument();
    expect(
        screen.queryByText('file_input.instruction_multiple')
    ).not.toBeInTheDocument();
    expect(
        screen.queryByRole('button', { name: 'file_input.add_another' })
    ).not.toBeInTheDocument();

    fireEvent.click(
        screen.getByRole('button', {
            name: 'file_input.discard: first.pdf',
        })
    );

    expect(screen.queryByText('first.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('second.pdf')).toBeInTheDocument();
    expect(
        screen.getByRole('button', { name: 'file_input.add_another' })
    ).toBeInTheDocument();
});

test('includes persisted files when enforcing the multiple-file limit', () => {
    const onChange = jest.fn();
    const persistedFile = {
        id: 1,
        name: 'persisted.pdf',
        url: '/persisted.pdf',
        contentType: 'application/pdf',
    };
    render(
        <FileInputField
            id="documents"
            name="documents"
            label="Documents"
            currentFiles={[persistedFile]}
            multiple
            maxFiles={2}
            onChange={onChange}
        />
    );
    const first = new File(['first'], 'first.pdf', {
        type: 'application/pdf',
    });
    const second = new File(['second'], 'second.pdf', {
        type: 'application/pdf',
    });

    fireEvent.change(
        screen.getByLabelText('Documents', { selector: 'input' }),
        {
            target: { files: [first, second] },
        }
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
        'file_input.errors.too_many_files'
    );
});

test('displays a persisted file and delegates its removal', () => {
    const onRemoveCurrent = jest.fn();
    const persistedFile = {
        id: 1,
        name: 'archive.pdf',
        url: '/archive.pdf',
        contentType: 'application/pdf',
    };
    render(
        <FileInputField
            id="document"
            name="document"
            label="Document"
            currentFiles={persistedFile}
            onChange={jest.fn()}
            onRemoveCurrent={onRemoveCurrent}
        />
    );

    expect(
        screen.queryByText('file_input.instruction')
    ).not.toBeInTheDocument();
    expect(
        screen.getByRole('button', { name: 'file_input.replace' })
    ).toBeInTheDocument();
    const input = screen.getByLabelText('Document', { selector: 'input' });
    const clickSpy = jest.spyOn(input, 'click');

    fireEvent.click(screen.getByRole('button', { name: 'file_input.replace' }));

    expect(clickSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(
        screen.getByRole('button', {
            name: 'file_input.remove: archive.pdf',
        })
    );

    expect(onRemoveCurrent).toHaveBeenCalledWith(persistedFile);
});
