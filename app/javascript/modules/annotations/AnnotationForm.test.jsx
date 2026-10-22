/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { submitData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { useDispatch } from 'react-redux';
import RichTextEditor from 'react-rte-18support';

import AnnotationForm from './AnnotationForm';

jest.mock('modules/data', () => ({
    submitData: jest.fn(() => ({ type: 'SAVE_ANNOTATION' })),
}));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('react-redux', () => ({ useDispatch: jest.fn() }));
jest.mock('modules/ui/Buttons', () => ({
    CancelButton: ({ buttonText, handleCancel }) => (
        <button type="button" onClick={handleCancel}>
            {buttonText}
        </button>
    ),
    SubmitButton: ({ buttonText }) => (
        <button type="submit">{buttonText}</button>
    ),
}));
jest.mock('react-rte-18support', () => {
    /**
     * Creates a minimal immutable editor value for serialization checks.
     * @param {string} html - Stored or edited HTML.
     * @returns {Object} Editor value.
     */
    const valueFromHtml = (html) =>
        Object.freeze({ html, toString: () => html });
    const Editor = jest.fn(({ value, onChange }) => (
        <textarea
            aria-label="Annotation"
            value={value.html}
            onChange={(event) => onChange(valueFromHtml(event.target.value))}
        />
    ));
    Editor.createValueFromString = jest.fn((html) => valueFromHtml(html));
    Editor.createEmptyValue = jest.fn(() => valueFromHtml(''));
    return { __esModule: true, default: Editor };
});

const segment = { id: 3, interview_id: 7 };
const mockDispatch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    usePathBase.mockReturnValue('/pilot/en');
    useDispatch.mockReturnValue(mockDispatch);
});

test.each(['/pilot/en', '/de'])(
    'creates annotations through %s with content locale and completion callback',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const onSubmit = jest.fn();
        render(
            <AnnotationForm
                segment={segment}
                contentLocale="ger"
                onSubmit={onSubmit}
                submitLabel="Save"
            />
        );
        expect(screen.getByRole('textbox')).toHaveValue('');
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: '<p>New note</p>' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(submitData).toHaveBeenCalledWith(
            { pathBase },
            {
                annotation: {
                    id: undefined,
                    segment_id: 3,
                    interview_id: 7,
                    locale: 'ger',
                    text: '<p>New note</p>',
                },
            },
            {},
            onSubmit
        );
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'SAVE_ANNOTATION' });
        expect(onSubmit).not.toHaveBeenCalled();
    }
);

test('keeps the editor value intact when saving again after a failed attempt', () => {
    const annotation = { id: 12, text: { ger: '<p>Original</p>' } };
    const { rerender } = render(
        <AnnotationForm
            annotation={annotation}
            segment={segment}
            contentLocale="ger"
            onSubmit={jest.fn()}
            submitLabel="Save"
        />
    );
    expect(screen.getByRole('textbox')).toHaveValue('<p>Original</p>');
    const originalEditorValue = RichTextEditor.mock.lastCall[0].value;
    fireEvent.click(screen.getByRole('button', { name: /Save/ }));
    rerender(
        <AnnotationForm
            annotation={annotation}
            segment={segment}
            contentLocale="ger"
            onSubmit={jest.fn()}
            submitLabel="Save again"
        />
    );
    expect(RichTextEditor.mock.lastCall[0].value).toBe(originalEditorValue);
    expect(screen.getByRole('textbox')).toHaveValue('<p>Original</p>');
    fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '<p>Retry</p>' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save/ }));
    expect(submitData.mock.calls[0][1].annotation).toMatchObject({
        id: 12,
        text: '<p>Original</p>',
    });
    expect(submitData.mock.calls[1][1].annotation).toMatchObject({
        id: 12,
        text: '<p>Retry</p>',
    });
    expect(originalEditorValue.toString('html')).toBe('<p>Original</p>');
    expect(RichTextEditor.mock.lastCall[0].value.toString('html')).toBe(
        '<p>Retry</p>'
    );
    expect(annotation.text.ger).toBe('<p>Original</p>');
});

test('cancel uses the supplied label and callback without saving', () => {
    const onCancel = jest.fn();
    render(
        <AnnotationForm
            segment={segment}
            contentLocale="eng"
            onSubmit={jest.fn()}
            onCancel={onCancel}
            cancelLabel="Discard"
            submitLabel="Save"
        />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Discard' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(submitData).not.toHaveBeenCalled();
});
