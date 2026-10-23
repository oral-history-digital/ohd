/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';

import RegistryEntries from './RegistryEntries';
import useRegistryEntries from './useRegistryEntries';

let mockCanCreate;
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => (mockCanCreate ? children : null),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/spinners', () => ({
    PixelLoader: () => <p>Loading children</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
    Modal: ({ children }) => children(jest.fn()),
}));
jest.mock(
    './RegistryEntryContainer',
    () =>
        function Entry({ data }) {
            return <li>{data.name.en}</li>;
        }
);
jest.mock(
    './RegistryEntryFormContainer',
    () =>
        function EntryForm() {
            return <p>Add entry</p>;
        }
);
jest.mock('./useRegistryEntries', () => jest.fn());

beforeEach(() => {
    mockCanCreate = false;
});

test('shows project errors instead of retained children or creation controls', () => {
    useRegistryEntries.mockReturnValue({
        dataLoaded: false,
        registryEntries: [],
    });
    const { rerender } = render(
        <RegistryEntries registryEntryParent={{ id: 1 }} />
    );
    expect(screen.getByText('Loading children')).toBeInTheDocument();
    mockCanCreate = true;
    useRegistryEntries.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<RegistryEntries registryEntryParent={{ id: 1 }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByText('Loading children')).not.toBeInTheDocument();
    expect(screen.queryByText('Add entry')).not.toBeInTheDocument();
});

test('renders loaded children and preserves root styling and authorized creation controls', () => {
    useRegistryEntries.mockReturnValue({
        dataLoaded: true,
        registryEntries: [{ id: 2, name: { en: 'Child' } }],
    });
    const { rerender } = render(
        <RegistryEntries registryEntryParent={{ id: 1 }} root />
    );
    expect(screen.getByRole('list')).toHaveClass('RegistryEntryList--root');
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.queryByText('Add entry')).not.toBeInTheDocument();
    mockCanCreate = true;
    rerender(<RegistryEntries registryEntryParent={{ id: 1 }} root />);
    expect(screen.getByText('Add entry')).toBeInTheDocument();
});
