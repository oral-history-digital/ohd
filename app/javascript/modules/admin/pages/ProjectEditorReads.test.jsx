/* eslint-disable react/prop-types */
import { act, render, screen } from '@testing-library/react';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useProject } from 'modules/routes';
import { MemoryRouter } from 'react-router-dom';

import EventTypeForm from '../../event-types/EventTypeForm';
import InterviewForm from './interviews/InterviewForm';
import MetadataFieldForm from './metadata/MetadataFieldForm';
import UploadsForm from './uploads/UploadsForm';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: () => ({}),
}));
jest.mock('modules/data', () => ({
    FetchProjectResource: ({ children }) => children,
    Fetch: ({ children }) => children,
    submitData: jest.fn(() => ({ type: 'SAVE' })),
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/adg/en',
}));
jest.mock('modules/forms', () => ({ Form: jest.fn(() => <p>Editor</p>) }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => true }),
}));
jest.mock('modules/event-types', () => ({
    useEventTypes: () => ({ data: [] }),
}));
jest.mock('../hooks', () => ({
    useCombinedRegistryReferenceTypes: () => ({ registryReferenceTypes: [] }),
}));
jest.mock('modules/person', () => ({ usePeople: () => ({ data: {} }) }));
jest.mock('modules/interview-metadata', () => ({
    ContributionFormContainer: () => null,
}));
jest.mock('modules/api', () => ({ submitDataWithFetch: jest.fn() }));
jest.mock('../../event-types/useMutateEventTypes', () => ({
    __esModule: true,
    default: () => jest.fn(),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test.each([InterviewForm, UploadsForm, EventTypeForm, MetadataFieldForm])(
    'editor waits for project data and hides retained forms after an access error (%p)',
    (Component) => {
        useProject.mockReturnValue({ isLoading: true });
        const { rerender } = render(<Component />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(Form).not.toHaveBeenCalled();
        useProject.mockReturnValue({
            project: {
                id: 7,
                shortname: 'adg',
                archive_id_number_length: 3,
                available_locales: ['en'],
                upload_types: ['bulk_metadata'],
            },
        });
        rerender(<Component />);
        expect(screen.getByText('Editor')).toBeInTheDocument();
        useProject.mockReturnValue({
            project: { id: 7 },
            error: { message: 'Access denied' },
        });
        rerender(<Component />);
        expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
        expect(screen.queryByText('Editor')).not.toBeInTheDocument();
    }
);

test('interview creation uses form options for public ID validation and saves on the current route', () => {
    useProject.mockReturnValue({
        project: { id: 7, shortname: 'adg', archive_id_number_length: 3 },
    });
    render(
        <MemoryRouter>
            <InterviewForm />
        </MemoryRouter>
    );
    expect(useProject).toHaveBeenCalledWith({ include: ['form_options'] });
    const form = Form.mock.lastCall[0];
    expect(form.values.project_id).toBe(7);
    const archiveId = form.elements.find(
        (field) => field.attribute === 'archive_id'
    );
    expect(archiveId.validate('adg001')).toBe(true);
    expect(archiveId.validate('adg01')).toBe(false);
    act(() => form.onSubmit({ interview: { archive_id: 'adg001' } }));
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        { interview: { archive_id: 'adg001' } }
    );
    expect(screen.getByText('edit.interview.processing')).toBeInTheDocument();
});

test('imports use configured locales and upload types and retain file validation', () => {
    useProject.mockReturnValue({
        project: {
            available_locales: ['de', 'en'],
            upload_types: ['bulk_metadata'],
        },
    });
    render(<UploadsForm />);
    const form = Form.mock.lastCall[0];
    expect(
        form.elements.find((field) => field.attribute === 'lang').values
    ).toEqual(['de', 'en']);
    expect(
        form.elements.find((field) => field.attribute === 'type').values
    ).toEqual(['bulk_metadata']);
    expect(
        form.elements
            .find((field) => field.attribute === 'data')
            .validate('file')
    ).toBe(false);
});

test('metadata field choices exclude names already configured for the same source', () => {
    useProject.mockReturnValue({
        project: {
            id: 7,
            metadata_fields: [
                { id: 1, source: 'Interview', name: 'media_type' },
            ],
        },
    });
    render(
        <MetadataFieldForm
            data={{ id: 2, source: 'Interview', name: 'archive_id' }}
        />
    );
    expect(useProject).toHaveBeenCalledWith({ include: ['metadata_fields'] });
    const names = Form.mock.lastCall[0].elements.find(
        (field) => field.attribute === 'name'
    ).values;
    expect(names).not.toContain('media_type');
    expect(names).toContain('archive_id');
});
