/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useProjectIdentity } from 'modules/routes';

import RegistryEntriesTabPanel from './RegistryEntriesTabPanel';

jest.mock('modules/routes', () => ({ useProjectIdentity: jest.fn() }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock('modules/auth', () => ({ AuthorizedContent: () => null }));
jest.mock('modules/registry', () => ({
    RegistrySearchFormContainer: () => <p>Registry search</p>,
}));
jest.mock(
    './DownloadRegistryEntries',
    () =>
        function Download() {
            return null;
        }
);

test.each([
    ['adg', true, false, 1],
    ['other', false, true, 0],
])(
    'uses %s identity for the view toggle and project-specific link',
    (shortname, showResults, nextView, linkCount) => {
        useProjectIdentity.mockReturnValue({ projectShortname: shortname });
        const changeRegistryEntriesViewMode = jest.fn();
        render(
            <RegistryEntriesTabPanel
                showRegistryEntriesSearchResults={showResults}
                locales={['en']}
                changeRegistryEntriesViewMode={changeRegistryEntriesViewMode}
            />
        );
        expect(screen.getByText('Registry search')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(changeRegistryEntriesViewMode).toHaveBeenCalledWith(
            nextView,
            shortname
        );
        expect(screen.queryAllByRole('link')).toHaveLength(linkCount);
    }
);
