/* eslint-disable react/prop-types */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePathBase } from 'modules/routes';

import RegistryReference from './RegistryReference';
import RegistryReferenceFormContainer from './RegistryReferenceFormContainer';

let mockAuthorized;
const mockDeleteReference = jest.fn();
const mockMutatePerson = jest.fn((id, update) => update());
const mockMutateLandingPage = jest.fn();

jest.mock('modules/api', () => ({
    useRegistryReferenceApi: () => ({
        deleteRegistryReference: mockDeleteReference,
    }),
}));
jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => mockAuthorized }),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/person', () => ({
    useMutatePersonWithAssociations: () => mockMutatePerson,
    useMutatePersonLandingPageMetadata: () => mockMutateLandingPage,
}));
jest.mock('modules/ui', () => ({
    Modal: ({ children }) => children(jest.fn()),
}));
jest.mock('modules/forms', () => ({
    DeleteItemForm: ({ onSubmit }) => (
        <button onClick={onSubmit}>Confirm deletion</button>
    ),
}));
jest.mock('./RegistryReferenceFormContainer', () =>
    jest.fn(() => <p>Edit reference</p>)
);

const entry = {
    id: 7,
    name: { en: 'English name', de: 'Deutscher Name' },
    notes: { en: 'Note' },
    associations_loaded: true,
};
const fetchData = jest.fn();
const deleteData = jest.fn();
const props = {
    registryEntry: entry,
    registryReference: { id: 4, registry_entry_id: 7 },
    registryEntries: { 7: entry },
    registryEntriesStatus: { 7: 'fetched' },
    refObject: { type: 'Interview', archive_id: 'H-001', id: 9 },
    lowestAllowedRegistryEntryId: 12,
    registryReferenceTypeId: 5,
    fetchData,
    deleteData,
};

beforeEach(() => {
    jest.clearAllMocks();
    mockAuthorized = false;
    usePathBase.mockReturnValue('/en');
    mockDeleteReference.mockResolvedValue({ data: { id: 9 } });
});

test('loads missing associations through the route base and avoids pending or complete loads', () => {
    const incomplete = { 7: { ...entry, associations_loaded: false } };
    const { rerender } = render(
        <RegistryReference {...props} registryEntries={incomplete} />
    );
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        'registry_entries',
        7,
        null,
        'with_associations=true'
    );
    rerender(
        <RegistryReference
            {...props}
            registryEntries={incomplete}
            registryEntriesStatus={{ 7: 'fetching' }}
        />
    );
    expect(fetchData).toHaveBeenCalledTimes(1);
    rerender(<RegistryReference {...props} />);
    expect(fetchData).toHaveBeenCalledTimes(1);
});

test('preserves localized names, note toggling, edit limits, and permission checks', () => {
    const setOpenReference = jest.fn();
    const { rerender } = render(
        <RegistryReference
            {...props}
            contentLocale="de"
            setOpenReference={setOpenReference}
        />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Deutscher Name' }));
    const toggle = setOpenReference.mock.calls[0][0];
    expect(toggle(null)).toBe(entry);
    expect(toggle(entry)).toBeNull();
    expect(screen.queryByText('Edit reference')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm deletion')).not.toBeInTheDocument();

    mockAuthorized = true;
    rerender(<RegistryReference {...props} />);
    expect(screen.getByText('Edit reference')).toBeInTheDocument();
    expect(RegistryReferenceFormContainer.mock.calls.at(-1)[0]).toMatchObject({
        lowestAllowedRegistryEntryId: 12,
        registryReferenceTypeId: 5,
    });
    rerender(<RegistryReference {...props} hideEdit />);
    expect(screen.queryByText('Edit reference')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm deletion')).not.toBeInTheDocument();
});

test.each([
    [
        'Interview',
        { pathBase: '/en' },
        'interviews',
        'H-001',
        'registry_references',
        4,
    ],
    [
        'Segment',
        { pathBase: '/en' },
        'registry_references',
        4,
        null,
        null,
        true,
    ],
])(
    'preserves the Redux deletion flow for %s references',
    (type, ...expected) => {
        mockAuthorized = true;
        render(
            <RegistryReference
                {...props}
                refObject={{ ...props.refObject, type }}
            />
        );
        fireEvent.click(screen.getByText('Confirm deletion'));
        expect(deleteData).toHaveBeenCalledWith(...expected);
        expect(mockMutatePerson).not.toHaveBeenCalled();
    }
);

test('deletes person references through the API and refreshes both person representations', async () => {
    mockAuthorized = true;
    render(
        <RegistryReference {...props} refObject={{ id: 9, type: 'Person' }} />
    );
    fireEvent.click(screen.getByText('Confirm deletion'));
    expect(mockMutatePerson).toHaveBeenCalledWith(9, expect.any(Function));
    expect(mockDeleteReference).toHaveBeenCalledWith(4);
    await waitFor(() => expect(mockMutateLandingPage).toHaveBeenCalledWith(9));
    expect(deleteData).not.toHaveBeenCalled();
});
