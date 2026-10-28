/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';

import RegistryReferenceContainer from './RegistryReferenceContainer';
import RegistryReferenceFormContainer from './RegistryReferenceFormContainer';
import RegistryReferences from './RegistryReferences';

let mockCanCreate;
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => (mockCanCreate ? children : null),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
    Modal: ({ children }) => children(jest.fn()),
}));
jest.mock('./RegistryReferenceContainer', () =>
    jest.fn(({ registryEntry }) => <li>{registryEntry.name.en}</li>)
);
jest.mock('./RegistryReferenceFormContainer', () =>
    jest.fn(() => <p>Create reference</p>)
);

const props = {
    interview: { id: 9 },
    refObject: {
        id: 7,
        type: 'Person',
        registry_references: {
            1: {
                id: 1,
                registry_entry_id: 10,
                registry_reference_type_id: 5,
                interview_id: 9,
            },
            2: {
                id: 2,
                registry_entry_id: 20,
                registry_reference_type_id: 5,
                interview_id: 99,
            },
            3: {
                id: 3,
                registry_entry_id: 30,
                registry_reference_type_id: 6,
                interview_id: 9,
            },
            4: {
                id: 4,
                registry_entry_id: 40,
                registry_reference_type_id: 5,
                interview_id: 9,
            },
        },
    },
    registryReferenceTypeId: 5,
    registryEntries: {
        10: { name: { en: 'Matching reference' } },
        20: { name: { en: 'Another interview' } },
        30: { name: { en: 'Another type' } },
        40: { name: { de: 'No English name' } },
    },
    registryEntriesStatus: {
        1: 'fetched',
        ref_object_type_Person_ref_object_id_7: 'fetched',
    },
};

beforeEach(() => {
    jest.clearAllMocks();
    mockCanCreate = false;
    useProject.mockReturnValue({ project: { root_registry_entry_id: 1 } });
});

test('waits for project configuration and hides references after a denied read', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<RegistryReferences {...props} />);
    expect(useProject).toHaveBeenCalledWith({
        include: ['registry_configuration'],
    });
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(RegistryReferenceContainer).not.toHaveBeenCalled();

    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<RegistryReferences {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(RegistryReferenceContainer).not.toHaveBeenCalled();
});

test('keeps interview, reference type, and locale filtering and preserves tree limits and creation controls', () => {
    mockCanCreate = true;
    const { rerender } = render(<RegistryReferences {...props} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Matching reference')).toBeInTheDocument();
    expect(
        RegistryReferenceContainer.mock.calls[0][0].lowestAllowedRegistryEntryId
    ).toBe(1);
    expect(screen.getByText('Create reference')).toBeInTheDocument();
    expect(RegistryReferenceFormContainer.mock.calls[0][0]).toMatchObject({
        interview: props.interview,
        refObject: props.refObject,
        registryReferenceTypeId: 5,
    });

    rerender(
        <RegistryReferences {...props} lowestAllowedRegistryEntryId={12} />
    );
    expect(
        RegistryReferenceContainer.mock.calls.at(-1)[0]
            .lowestAllowedRegistryEntryId
    ).toBe(12);
    expect(
        RegistryReferenceFormContainer.mock.calls.at(-1)[0]
            .lowestAllowedRegistryEntryId
    ).toBe(12);

    mockCanCreate = false;
    rerender(<RegistryReferences {...props} />);
    expect(screen.queryByText('Create reference')).not.toBeInTheDocument();
});

test('renders references only after the root and reference query are fetched', () => {
    const { rerender } = render(
        <RegistryReferences
            {...props}
            registryEntriesStatus={{ 1: 'fetching' }}
        />
    );
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    rerender(
        <RegistryReferences
            {...props}
            registryEntriesStatus={{
                1: 'fetched',
                ref_object_type_Person_ref_object_id_7: 'fetching',
            }}
        />
    );
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    rerender(<RegistryReferences {...props} />);
    expect(screen.getByText('Matching reference')).toBeInTheDocument();

    useProject.mockReturnValue({ project: { root_registry_entry_id: null } });
    rerender(<RegistryReferences {...props} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
