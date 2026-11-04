/* eslint-disable react/prop-types */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useProject } from 'modules/routes';

import SingleTextInputForm from './SingleTextInputForm';
import SingleValueWithForm from './SingleValueWithForm';
import StatusForm from './StatusForm';
import SubmitOnBlurForm from './SubmitOnBlurForm';

const mockDispatch = jest.fn();
jest.mock('modules/routes', () => ({
    usePathBase: () => '/adg/en',
    useProject: jest.fn(),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/archive', () => ({ getEditView: () => true }));
jest.mock('modules/data', () => ({
    submitData: jest.fn(() => ({ type: 'SAVE' })),
    getCurrentUser: () => ({ admin: true }),
}));
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (select) => select({}),
}));
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => children,
    admin: () => true,
    useProjectAccessStatus: () => ({ projectAccessGranted: true }),
}));
jest.mock('modules/forms', () => ({
    Form: jest.fn(() => <p>Editing form</p>),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({
        project: {
            id: 7,
            metadata_fields: [{ name: 'title', label: 'Localized label' }],
        },
    });
});

test('inline fields wait for metadata and save through the route with localized labels', () => {
    useProject.mockReturnValue({ isLoading: true });
    const props = {
        obj: { type: 'Interview', id: 9 },
        attribute: 'title',
        value: 'Title',
    };
    const { rerender } = render(<SingleValueWithForm {...props} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    useProject.mockReturnValue({
        project: {
            id: 7,
            metadata_fields: [{ name: 'title', label: 'Localized label' }],
        },
    });
    rerender(<SingleValueWithForm {...props} />);
    expect(useProject).toHaveBeenCalledWith({ include: ['metadata_fields'] });
    fireEvent.click(screen.getByTestId('edit-toggle-button'));
    const form = Form.mock.lastCall[0];
    expect(form.elements[0].label).toBe('Localized label');
    act(() => form.onSubmit({ interview: { id: 9, title: 'Updated' } }));
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        { interview: { id: 9, title: 'Updated' } },
        { updateStateBeforeSubmit: true }
    );
    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<SingleValueWithForm {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByTestId('edit-toggle-button')).not.toBeInTheDocument();
});

test('status updates retain optimistic saving and nested replacement forms retain their index', () => {
    const { unmount } = render(
        <StatusForm
            data={{ id: 9 }}
            scope="interview"
            attribute="public_title"
            value
        />
    );
    fireEvent.click(screen.getByRole('button'));
    act(() =>
        Form.mock.lastCall[0].onSubmit({
            interview: { id: 9, public_title: true },
        })
    );
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        { interview: { id: 9, public_title: true } },
        { updateStateBeforeSubmit: true }
    );
    unmount();
    const submit = jest.fn();
    render(<SingleTextInputForm submitData={submit} index={2} nested />);
    act(() => Form.mock.lastCall[0].onSubmit({ text: { replacement: '*' } }));
    expect(submit).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        { text: { replacement: '*' } },
        2
    );
});

test('blur saves keep the content translation locale separate from the request route', () => {
    render(
        <SubmitOnBlurForm
            scope="segment"
            attribute="text"
            locale="fr"
            data={{
                id: 9,
                translations_attributes: [{ id: 3, locale: 'fr', text: 'Old' }],
            }}
        />
    );
    fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Updated' },
    });
    fireEvent.blur(screen.getByRole('textbox'));
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        {
            segment: {
                id: 9,
                translations_attributes: [
                    { id: 3, locale: 'fr', text: 'Updated' },
                ],
            },
        }
    );
});
