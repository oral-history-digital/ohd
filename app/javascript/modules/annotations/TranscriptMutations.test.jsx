/* eslint-disable react/prop-types */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';

import MarkTextForm from '../interview-actions/MarkTextForm';
import Annotation from './Annotation';

let mockAuthorized;
const mockClose = jest.fn();
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => (mockAuthorized ? children : null),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/utils', () => ({ sanitizeHtml: (html) => html }));
jest.mock('modules/ui', () => ({
    Modal: ({ children }) => children(mockClose),
}));
jest.mock('modules/forms', () => ({
    Form: jest.fn(() => <p>Mark text form</p>),
    SingleTextInputForm: () => null,
    DeleteItemForm: ({ onSubmit }) => (
        <button onClick={onSubmit}>Delete annotation</button>
    ),
}));
jest.mock(
    './AnnotationForm',
    () =>
        function AnnotationForm() {
            return null;
        }
);

beforeEach(() => {
    jest.clearAllMocks();
    mockAuthorized = true;
    usePathBase.mockReturnValue('/pilot/en');
});

test.each(['/pilot/en', '/de'])(
    'deletes annotations through %s and retains permission gating',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const props = {
            annotation: { id: 8, text: { eng: 'Annotation' } },
            segment: { id: 7 },
            contentLocale: 'eng',
            deleteData: jest.fn(),
        };
        const { rerender } = render(<Annotation {...props} />);
        fireEvent.click(
            screen.getByRole('button', { name: 'Delete annotation' })
        );
        expect(props.deleteData).toHaveBeenCalledWith(
            { pathBase },
            'annotations',
            8,
            null,
            null,
            true
        );
        expect(mockClose).toHaveBeenCalledTimes(1);
        mockAuthorized = false;
        rerender(<Annotation {...props} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByText('Annotation')).toBeInTheDocument();
    }
);

test('preserves text-marking languages, public interview ID, nested replacement data, and status', () => {
    const submitData = jest.fn();
    const props = {
        submitData,
        interview: { archive_id: 'pilot001', alpha3s: ['eng', 'deu'] },
        archiveId: 'pilot001',
        markTextStatus: {},
    };
    const { rerender } = render(<MarkTextForm {...props} />);
    const form = Form.mock.calls.at(-1)[0];
    expect(form.values).toEqual({ id: 'pilot001' });
    expect(form.elements[0].values).toEqual({
        eng: { name: 'eng' },
        deu: { name: 'deu' },
    });
    expect(form.nestedScopeProps[0]).toMatchObject({
        scope: 'text',
        parent: props.interview,
    });
    const params = {
        mark_text: {
            id: 'pilot001',
            locale: 'eng',
            texts_attributes: [{ text_to_mark: 'Name', replacement: '***' }],
        },
    };
    act(() => form.onSubmit(params));
    expect(submitData).toHaveBeenCalledWith({ pathBase: '/pilot/en' }, params);
    expect(screen.queryByText('Mark text form')).not.toBeInTheDocument();
    rerender(
        <MarkTextForm
            {...props}
            markTextStatus={{ for_interviews_pilot001: 'processing' }}
        />
    );
    expect(screen.getByText('edit.text.processing')).toBeInTheDocument();
});
