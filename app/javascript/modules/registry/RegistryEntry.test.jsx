/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { usePathBase } from 'modules/routes';

import RegistryEntry from './RegistryEntry';

let mockCanEdit;
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => (mockCanEdit ? children : null),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/user', () => ({ getIsLoggedIn: () => false }));
jest.mock('react-redux', () => ({ useSelector: (selector) => selector() }));
jest.mock('modules/ui', () => ({
    Checkbox: ({ checked, onChange }) => (
        <input type="checkbox" checked={checked} onChange={onChange} />
    ),
    Modal: ({ children }) => children(jest.fn()),
}));
jest.mock(
    './NormDataLinks',
    () =>
        function NormDataLinks() {
            return null;
        }
);
jest.mock(
    './OpenStreetMapLink',
    () =>
        function MapLink() {
            return null;
        }
);
jest.mock(
    './RegistryEntryEditButtons',
    () =>
        function EditButtons() {
            return <p>Edit entry</p>;
        }
);
jest.mock(
    './RegistryEntryShow',
    () =>
        function EntryShow() {
            return null;
        }
);
jest.mock(
    './RegistryEntries',
    () =>
        function Children({ registryEntryParent }) {
            return <p>Children of {registryEntryParent.id}</p>;
        }
);

const entry = {
    id: 2,
    name: { en: 'Entry name' },
    children_count: 2,
    registry_references_count: 0,
    latitude: 0,
    longitude: 0,
};
const props = {
    data: entry,
    registryEntries: { 2: entry },
    registryEntriesStatus: { 2: 'fetched-123' },
    registryEntryParent: { id: 1 },
    selectedRegistryEntryIds: [],
    fetchData: jest.fn(),
    addRemoveRegistryEntryId: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    mockCanEdit = false;
    usePathBase.mockReturnValue('/en');
});

test('loads missing entries and reloads invalidated entries through the current route', () => {
    const { rerender } = render(
        <RegistryEntry
            {...props}
            registryEntries={{}}
            registryEntriesStatus={{}}
        />
    );
    expect(props.fetchData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        'registry_entries',
        2
    );
    rerender(
        <RegistryEntry
            {...props}
            registryEntries={{}}
            registryEntriesStatus={{ 2: 'fetching' }}
        />
    );
    expect(props.fetchData).toHaveBeenCalledTimes(1);
    rerender(<RegistryEntry {...props} />);
    expect(props.fetchData).toHaveBeenCalledTimes(1);

    usePathBase.mockReturnValue('/history/de');
    rerender(
        <RegistryEntry {...props} registryEntriesStatus={{ 2: 'reload-456' }} />
    );
    expect(props.fetchData).toHaveBeenLastCalledWith(
        { pathBase: '/history/de' },
        'registry_entries',
        2
    );
    expect(props.fetchData).toHaveBeenCalledTimes(2);
});

test('preserves entry labels, expansion, selection, and authorized edit controls', () => {
    const { rerender } = render(<RegistryEntry {...props} />);
    expect(screen.getByText('Entry name')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit entry')).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', {
        name: '2 edit.registry_entry.show_children',
    });
    fireEvent.click(toggle);
    expect(screen.getByText('Children of 2')).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.queryByText('Children of 2')).not.toBeInTheDocument();

    mockCanEdit = true;
    rerender(<RegistryEntry {...props} />);
    expect(screen.getByText('Edit entry')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(props.addRemoveRegistryEntryId).toHaveBeenCalledWith(2);
    rerender(<RegistryEntry {...props} selectedRegistryEntryIds={[2]} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(props.fetchData).not.toHaveBeenCalled();
});
