/* eslint-disable react/prop-types */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useProject } from 'modules/routes';

import TextPage from './TextPage';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/adg/en',
}));
jest.mock('modules/data', () => ({
    submitData: jest.fn(() => ({ type: 'SAVE' })),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => children,
}));
jest.mock('modules/forms', () => ({ Form: jest.fn(() => <p>Text editor</p>) }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/user-agent', () => ({
    ScrollToTop: ({ children }) => children,
}));

beforeEach(() => jest.clearAllMocks());

test('page displays localized text and requests stored translations only after editing is opened', () => {
    useProject.mockReturnValue({
        project: {
            id: 7,
            texts: [
                { id: 3, code: 'conditions', text: '<p>English terms</p>' },
            ],
        },
    });
    const { rerender } = render(<TextPage code="conditions" />);
    expect(useProject).toHaveBeenLastCalledWith({
        profile: 'display',
        include: ['texts'],
    });
    expect(screen.getByText('English terms')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'edit.default.edit' }));
    expect(useProject).toHaveBeenLastCalledWith({
        profile: 'edit',
        include: ['texts'],
    });
    useProject.mockReturnValue({ isLoading: true });
    rerender(<TextPage code="conditions" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    const translations = [
        { id: 8, locale: 'en', text: '' },
        { id: 9, locale: 'de', text: 'Bedingungen' },
    ];
    useProject.mockReturnValue({
        project: {
            id: 7,
            texts: [
                { id: 3, code: 'conditions', text: 'Fallback', translations },
            ],
        },
    });
    rerender(<TextPage code="conditions" />);
    const form = Form.mock.lastCall[0];
    expect(form.data.translations_attributes).toEqual(translations);
    expect(form.values).toEqual({ project_id: 7, code: 'conditions' });
    const params = { text: { id: 3, translations_attributes: translations } };
    act(() => form.onSubmit(params));
    expect(submitData).toHaveBeenCalledWith({ pathBase: '/adg/en' }, params);
    expect(useProject).toHaveBeenLastCalledWith({
        profile: 'display',
        include: ['texts'],
    });
});

test('page hides content and editing controls while loading or after access failure', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<TextPage code="contact" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<TextPage code="contact" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
