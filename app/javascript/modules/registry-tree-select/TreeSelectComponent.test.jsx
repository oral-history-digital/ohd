/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { fetchData } from 'modules/data';

import TreeSelectComponent from './TreeSelectComponent';

const mockDispatch = jest.fn();
jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'FETCH_ENTRY' })),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/routes', () => ({ usePathBase: () => '/en' }));
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock(
    'react-dropdown-tree-select',
    () =>
        function Dropdown({ onChange, disabled }) {
            return (
                <>
                    <button
                        disabled={disabled}
                        onClick={() => onChange(null, [{ value: 7 }])}
                    >
                        Select
                    </button>
                    <button onClick={() => onChange(null, [])}>Clear</button>
                </>
            );
        }
);

test('loads selected entry associations using the route and handles clearing and loading', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
        <TreeSelectComponent
            isLoading={false}
            tree={{ children: [] }}
            handleChange={handleChange}
        />
    );
    fireEvent.click(screen.getByText('Select'));
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/en' },
        'registry_entries',
        7,
        null,
        'with_associations=true'
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenLastCalledWith('registry_entry_id', 7);
    fireEvent.click(screen.getByText('Clear'));
    expect(fetchData).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenLastCalledWith(
        'registry_entry_id',
        undefined
    );
    rerender(
        <TreeSelectComponent
            isLoading
            tree={{ children: [] }}
            handleChange={handleChange}
        />
    );
    expect(screen.getByText('Select')).toBeDisabled();
});
