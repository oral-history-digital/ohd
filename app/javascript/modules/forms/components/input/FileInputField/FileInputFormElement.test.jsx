import { fireEvent, render, screen } from '@testing-library/react';

import FileInputFormElement from './FileInputFormElement';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));

const defaultProps = {
    scope: 'logo',
    attribute: 'file',
    handleChange: jest.fn(),
    handleErrors: jest.fn(),
    touchField: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
});

test('shows the persisted file and allows selecting its replacement', () => {
    const handleChange = jest.fn();
    render(
        <FileInputFormElement
            {...defaultProps}
            data={{
                src: '/logo.png',
                thumb_src: '/logo-thumb.png',
                filename: 'project-logo.png',
            }}
            preview="image"
            handleChange={handleChange}
        />
    );

    expect(screen.getByText('project-logo.png')).toBeInTheDocument();
    expect(
        document.querySelector('.FileInputField-preview img')
    ).toHaveAttribute('src', '/logo-thumb.png');

    const replacement = new File(['logo'], 'replacement.png', {
        type: 'image/png',
    });
    fireEvent.change(
        screen.getByLabelText('activerecord.attributes.logo.file', {
            selector: 'input',
        }),
        { target: { files: [replacement] } }
    );

    expect(handleChange).toHaveBeenCalledWith(
        'file',
        replacement,
        expect.objectContaining({ src: '/logo.png' })
    );
});

test('shows the empty picker when creating a logo', () => {
    render(<FileInputFormElement {...defaultProps} preview="image" />);

    expect(screen.getByText('file_input.instruction')).toBeInTheDocument();
});
