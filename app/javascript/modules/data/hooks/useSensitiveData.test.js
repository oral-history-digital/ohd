import { renderHook } from '@testing-library/react';
import { fetchData } from 'modules/data';
import { usePathBase } from 'modules/routes';

import useSensitiveData from './useSensitiveData';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'FETCH' })),
}));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));

test('requests missing fields once per record and route, without loading the project', () => {
    usePathBase.mockReturnValue('/adg/de');
    const { rerender } = renderHook(
        ({ data }) => useSensitiveData(data, ['private_text']),
        { initialProps: { data: { id: 7, type: 'Interview' } } }
    );
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/adg/de' },
        'interviews',
        7,
        'private_text'
    );
    rerender({ data: { id: 7, type: 'Interview' } });
    expect(fetchData).toHaveBeenCalledTimes(1);
    usePathBase.mockReturnValue('/en');
    rerender({ data: { id: 7, type: 'Interview' } });
    expect(fetchData).toHaveBeenLastCalledWith(
        { pathBase: '/en' },
        'interviews',
        7,
        'private_text'
    );
    rerender({ data: { id: 7, type: 'Interview', private_text: 'Loaded' } });
    expect(fetchData).toHaveBeenCalledTimes(2);
});
