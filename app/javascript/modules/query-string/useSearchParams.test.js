import { act, renderHook } from '@testing-library/react';
import { useTrackPageViewFunction } from 'modules/analytics';
import { useLocation, useNavigate } from 'react-router-dom';

import useSearchParams from './useSearchParams';

jest.mock('modules/analytics', () => ({
    useTrackPageViewFunction: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

beforeEach(() => {
    jest.resetAllMocks();
    useTrackPageViewFunction.mockReturnValue(jest.fn());
    useNavigate.mockReturnValue(jest.fn());
});

test('parses encoded fulltext, bracket facets, and year ranges', () => {
    useLocation.mockReturnValue({
        search: '?fulltext=Gr%C3%BC%C3%9Fe+%26+Erinnerungen&collection_id[]=001&collection_id[]=002&year_of_birth_min=1930&year_of_birth_max=1940',
    });

    const { result } = renderHook(useSearchParams);

    expect(result.current.fulltext).toBe('Grüße & Erinnerungen');
    expect(result.current.facets).toEqual({ collection_id: ['001', '002'] });
    expect(result.current.yearOfBirthMin).toBe(1930);
    expect(result.current.yearOfBirthMax).toBe(1940);
});

test('updates fulltext while preserving the project, locale, and bracket facets', () => {
    window.history.replaceState({}, '', '/history/de/searches/archive');
    useLocation.mockReturnValue({ search: '?collection_id[]=001&sort=title' });
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    const { result } = renderHook(useSearchParams);

    act(() => result.current.setFulltext('Grüße & Erinnerungen'));

    expect(navigate).toHaveBeenCalledWith(
        '/history/de/searches/archive?collection_id[]=001&fulltext=Gr%C3%BC%C3%9Fe%20%26%20Erinnerungen&sort=title',
        { replace: false }
    );
    window.history.replaceState({}, '', '/');
});

test('accepts malformed percent encoding without throwing', () => {
    useLocation.mockReturnValue({ search: '?fulltext=%zz%FF' });

    const { result } = renderHook(useSearchParams);

    expect(result.current.fulltext).toBe('%zz%FF');
});
