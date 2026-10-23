import { fireEvent, render, screen } from '@testing-library/react';
import { usePathBase, useProjectIdentity } from 'modules/routes';
import { isMobile } from 'modules/user-agent';

import RegistrySearchForm from './RegistrySearchForm';

jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/routes', () => ({
    usePathBase: jest.fn(),
    useProjectIdentity: jest.fn(),
}));
jest.mock('modules/user-agent', () => ({ isMobile: jest.fn() }));
jest.mock('modules/spinners', () => ({ PixelLoader: () => <p>Searching</p> }));

test.each([
    ['/project/en', false, 0],
    ['/de', true, 1],
])(
    'searches using %s and keeps view state keyed by shortname',
    (pathBase, mobile, closeCount) => {
        usePathBase.mockReturnValue(pathBase);
        useProjectIdentity.mockReturnValue({ projectShortname: 'project' });
        isMobile.mockReturnValue(mobile);
        const searchRegistryEntry = jest.fn();
        const changeRegistryEntriesViewMode = jest.fn();
        const hideSidebar = jest.fn();
        render(
            <RegistrySearchForm
                fulltext="Initial"
                isRegistryEntrySearching
                searchRegistryEntry={searchRegistryEntry}
                changeRegistryEntriesViewMode={changeRegistryEntriesViewMode}
                hideSidebar={hideSidebar}
            />
        );
        const input = screen.getByRole('searchbox');
        expect(input).toHaveValue('Initial');
        fireEvent.change(input, { target: { value: 'Berlin' } });
        fireEvent.submit(input.closest('form'));
        expect(searchRegistryEntry).toHaveBeenCalledWith(
            `${pathBase}/searches/registry_entry`,
            { fulltext: 'Berlin' }
        );
        expect(changeRegistryEntriesViewMode).toHaveBeenCalledWith(
            true,
            'project'
        );
        expect(hideSidebar).toHaveBeenCalledTimes(closeCount);
        expect(screen.getByText('Searching')).toBeInTheDocument();
    }
);
