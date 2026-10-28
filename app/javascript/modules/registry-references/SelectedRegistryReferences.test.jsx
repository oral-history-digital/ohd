/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProjectAccessStatus } from 'modules/auth';
import { useProject } from 'modules/routes';

import SelectedRegistryReferences from './SelectedRegistryReferences';

let mockInterview;
let mockUser;
jest.mock('modules/auth', () => ({
    useProjectAccessStatus: jest.fn(),
    useAuthorization: () => ({ isAuthorized: () => false }),
}));
jest.mock('modules/data', () => ({
    getCurrentInterview: () => mockInterview,
    getCurrentUser: () => mockUser,
}));
jest.mock('react-redux', () => ({ useSelector: (selector) => selector() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/en',
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock(
    './RegistryReferencesContainer',
    () =>
        function RegistryReferences({
            registryReferenceTypeId,
            lowestAllowedRegistryEntryId,
        }) {
            return (
                <p>
                    References {registryReferenceTypeId} under{' '}
                    {lowestAllowedRegistryEntryId}
                </p>
            );
        }
);

const project = {
    root_registry_entry_id: 1,
    metadata_fields: [
        {
            id: 1,
            name: 'birthplace',
            label: 'Public places',
            ref_object_type: 'Person',
            registry_entry_id: 10,
            registry_reference_type_id: 1,
            display_on_landing_page: true,
        },
        {
            id: 2,
            name: 'occupation',
            label: 'Private occupations',
            ref_object_type: 'Person',
            registry_entry_id: 20,
            registry_reference_type_id: 2,
            use_in_details_view: true,
        },
        {
            id: 3,
            name: 'custom',
            label: null,
            ref_object_type: 'Person',
            registry_entry_id: 30,
            registry_reference_type_id: 3,
            display_on_landing_page: true,
            use_in_details_view: true,
        },
        {
            id: 4,
            label: 'Interview field',
            ref_object_type: 'Interview',
            registry_entry_id: 40,
            display_on_landing_page: true,
            use_in_details_view: true,
        },
        {
            id: 5,
            label: 'Non-registry field',
            ref_object_type: 'Person',
            display_on_landing_page: true,
            use_in_details_view: true,
        },
    ],
};
const refObject = {
    id: 7,
    type: 'Person',
    registry_references: {
        1: { registry_reference_type_id: 1 },
        2: { registry_reference_type_id: 2 },
        3: { registry_reference_type_id: 3 },
    },
};
const fetchData = jest.fn();
const props = {
    refObject,
    fetchData,
    registryEntriesStatus: {
        1: 'fetched',
        ref_object_type_Person_ref_object_id_7: 'fetched',
    },
};

beforeEach(() => {
    jest.clearAllMocks();
    mockInterview = { id: 9, workflow_state: 'public' };
    mockUser = null;
    useProject.mockReturnValue({ project });
    useProjectAccessStatus.mockReturnValue({ projectAccessGranted: false });
});

test.each([
    [
        'visitor',
        false,
        'public',
        false,
        'Public places:',
        'Private occupations:',
    ],
    [
        'project access',
        true,
        'public',
        false,
        'Private occupations:',
        'Public places:',
    ],
    [
        'restricted without permission',
        true,
        'restricted',
        false,
        'Public places:',
        'Private occupations:',
    ],
    [
        'restricted with permission',
        true,
        'restricted',
        true,
        'Private occupations:',
        'Public places:',
    ],
])(
    'preserves field visibility for %s',
    (_, access, workflow, permission, visible, hidden) => {
        useProjectAccessStatus.mockReturnValue({
            projectAccessGranted: access,
        });
        mockInterview.workflow_state = workflow;
        mockUser = {
            interview_permissions: permission ? [{ interview_id: 9 }] : [],
        };
        render(<SelectedRegistryReferences {...props} />);
        expect(useProject).toHaveBeenCalledWith({
            include: ['metadata_fields', 'registry_configuration'],
        });
        expect(screen.getByText(visible)).toBeInTheDocument();
        expect(screen.queryByText(hidden)).not.toBeInTheDocument();
        expect(
            screen.getByText('activerecord.attributes.person.custom:')
        ).toBeInTheDocument();
        expect(screen.queryByText('Interview field:')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Non-registry field:')
        ).not.toBeInTheDocument();
        expect(fetchData).not.toHaveBeenCalled();
    }
);

test('shows fields without existing references only in edit view', () => {
    const empty = { ...refObject, registry_references: {} };
    const { rerender } = render(
        <SelectedRegistryReferences {...props} refObject={empty} />
    );
    expect(screen.queryByText('Public places:')).not.toBeInTheDocument();
    rerender(
        <SelectedRegistryReferences {...props} refObject={empty} editView />
    );
    expect(screen.getByText('Public places:')).toBeInTheDocument();
    expect(screen.getByText('References 1 under 10')).toBeInTheDocument();
});

test('waits for project settings and reports denial before loading registry entries', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <SelectedRegistryReferences {...props} registryEntriesStatus={{}} />
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(fetchData).not.toHaveBeenCalled();
    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(
        <SelectedRegistryReferences {...props} registryEntriesStatus={{}} />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(fetchData).not.toHaveBeenCalled();

    useProject.mockReturnValue({ project });
    rerender(
        <SelectedRegistryReferences {...props} registryEntriesStatus={{}} />
    );
    expect(fetchData.mock.calls).toEqual([
        [
            { pathBase: '/en' },
            'registry_entries',
            null,
            null,
            'ref_object_type=Person&ref_object_id=7',
        ],
        [{ pathBase: '/en' }, 'registry_entries', 1],
    ]);
    rerender(
        <SelectedRegistryReferences
            {...props}
            registryEntriesStatus={{
                1: 'fetching',
                ref_object_type_Person_ref_object_id_7: 'fetching',
            }}
        />
    );
    expect(fetchData).toHaveBeenCalledTimes(2);
});

test('reloads the root when requested and never fetches an entry without a root ID', () => {
    const { rerender } = render(
        <SelectedRegistryReferences
            {...props}
            registryEntriesStatus={{
                ...props.registryEntriesStatus,
                1: 'reload-123',
            }}
        />
    );
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        'registry_entries',
        1
    );
    fetchData.mockClear();
    useProject.mockReturnValue({
        project: { ...project, root_registry_entry_id: null },
    });
    rerender(<SelectedRegistryReferences {...props} />);
    expect(fetchData).not.toHaveBeenCalled();
});
