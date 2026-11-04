/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';

import Registry from './Registry';
import useRootEntry from './useRootEntry';

jest.mock('modules/analytics', () => ({ useTrackPageView: () => {} }));
jest.mock('modules/archive', () => ({ useIsEditor: () => false }));
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => children,
}));
jest.mock('modules/help-text', () => ({ HelpText: () => null }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/user-agent', () => ({
    ScrollToTop: ({ children }) => children,
}));
jest.mock(
    './MergeRegistryEntriesButtonContainer',
    () =>
        function MergeButton() {
            return null;
        }
);
jest.mock(
    './RegistrySearchResult',
    () =>
        function SearchResult() {
            return null;
        }
);
jest.mock(
    './RegistrySkeleton',
    () =>
        function Skeleton() {
            return <p>Loading registry</p>;
        }
);
jest.mock(
    './RegistryEntries',
    () =>
        function Entries({ registryEntryParent }) {
            return <p>Root {registryEntryParent.id}</p>;
        }
);
jest.mock('./useRootEntry', () => jest.fn());

const props = {
    foundRegistryEntries: {},
    showRegistryEntriesSearchResults: false,
};

test('replaces the loading indicator with the project read error', () => {
    useRootEntry.mockReturnValue({ isLoading: true });
    const { rerender } = render(<Registry {...props} />);
    expect(screen.getByText('Loading registry')).toBeInTheDocument();
    useRootEntry.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<Registry {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByText('Loading registry')).not.toBeInTheDocument();
});

test('renders a loaded root and handles a project without one', () => {
    useRootEntry.mockReturnValue({ data: { id: 1 }, isLoading: false });
    const { rerender, container } = render(<Registry {...props} />);
    expect(screen.getByText('Root 1')).toBeInTheDocument();
    useRootEntry.mockReturnValue({ data: undefined, isLoading: false });
    rerender(<Registry {...props} />);
    expect(container).toBeEmptyDOMElement();
});
