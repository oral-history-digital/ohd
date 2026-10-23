import { renderHook } from '@testing-library/react';
import { fetcher } from 'modules/api';
import { useMapReferenceTypes as useReferenceTypesForSearch } from 'modules/map';
import { useProject } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

import useSearchMap from '../../search-map/search-map/useSearchMap';
import useMapLocations from '../../search-map/useMapLocations';
import { MARKER_COLOR_SEGMENT_TYPE } from '../constants';
import useMapReferenceTypes from './useMapReferenceTypes';

jest.mock('modules/api', () => ({ fetcher: jest.fn() }));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/pilot/en',
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('swr/immutable', () => jest.fn());
jest.mock('react-redux', () => ({ useSelector: () => [] }));
jest.mock('../../search-map/useMapLocations', () => jest.fn());
jest.mock('modules/map', () => ({
    useMapReferenceTypes: jest.fn(),
    referenceTypesToColorMap: () => new Map(),
    transformIntoMarkers: () => [],
}));

const referenceTypes = [{ id: 3, name: 'Place', color: 'red' }];

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: { secondary_color: 'green' } });
    useSWRImmutable.mockReturnValue({ data: referenceTypes });
});

test('keeps the reference-type endpoint and adds segment mentions using the project color', () => {
    const { result, rerender } = renderHook(() => useMapReferenceTypes());
    expect(useProject).toHaveBeenCalledWith({});
    expect(useSWRImmutable).toHaveBeenCalledWith(
        '/pilot/en/searches/map_reference_types',
        fetcher
    );
    expect(result.current.referenceTypes).toEqual([
        ...referenceTypes,
        { id: 'segment', name: 'modules.map.mentions', color: 'green' },
    ]);
    expect(referenceTypes).toHaveLength(1);
    useProject.mockReturnValue({ project: { secondary_color: null } });
    rerender();
    expect(result.current.referenceTypes.at(-1).color).toBe(
        MARKER_COLOR_SEGMENT_TYPE
    );
});

test('hides retained types while project settings load or fail and reports endpoint errors', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(() => useMapReferenceTypes());
    expect(result.current.referenceTypes).toBeUndefined();
    const error = { message: 'Access denied' };
    useProject.mockReturnValue({
        project: { secondary_color: 'green' },
        error,
    });
    rerender();
    expect(result.current).toMatchObject({ referenceTypes: undefined, error });
    useProject.mockReturnValue({ project: {} });
    useSWRImmutable.mockReturnValue({ data: referenceTypes, error });
    rerender();
    expect(result.current).toMatchObject({ referenceTypes: undefined, error });
});

test('map search propagates reference-type and location errors', () => {
    const error = { message: 'Reference types failed' };
    useReferenceTypesForSearch.mockReturnValue({ error });
    useMapLocations.mockReturnValue({ locations: [] });
    const { result, rerender } = renderHook(() => useSearchMap());
    expect(result.current.error).toBe(error);
    useReferenceTypesForSearch.mockReturnValue({ referenceTypes: [] });
    useMapLocations.mockReturnValue({ error: { message: 'Locations failed' } });
    rerender();
    expect(result.current.error.message).toBe('Locations failed');
});
