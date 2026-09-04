import { renderHook } from '@testing-library/react';
import { fetcher } from 'modules/api';
import { getRegistryReferenceTypesForCurrentProject } from 'modules/data';
import { usePathBase, useProject } from 'modules/routes';
import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';

import useCombinedRegistryReferenceTypes from './useCombinedRegistryReferenceTypes';

jest.mock('modules/api', () => ({ fetcher: jest.fn() }));
jest.mock('modules/data', () => ({
    getRegistryReferenceTypesForCurrentProject: jest.fn(),
}));
jest.mock('modules/routes', () => ({
    usePathBase: jest.fn(),
    useProject: jest.fn(),
}));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('swr/immutable', () => jest.fn());

beforeEach(() => {
    jest.clearAllMocks();
    usePathBase.mockReturnValue('/project/en');
    useProject.mockReturnValue({ isOhd: false });
    useSelector.mockImplementation((selector) => {
        if (selector === getRegistryReferenceTypesForCurrentProject) {
            return { 1: { id: 1 }, 2: { id: 2 } };
        }
        return undefined;
    });
    useSWRImmutable.mockReturnValue({
        isLoading: false,
        isValidating: true,
        data: [{ id: 3 }],
        error: null,
    });
});

test('combines project and global types for non-OHD projects', () => {
    const { result } = renderHook(() => useCombinedRegistryReferenceTypes());

    expect(result.current.registryReferenceTypes).toEqual([
        { id: 1 },
        { id: 2 },
        { id: 3 },
    ]);
    expect(useSWRImmutable).toHaveBeenCalledWith(
        '/project/en/registry_reference_types/global.json',
        fetcher
    );
});

test('uses only project types for OHD projects', () => {
    useProject.mockReturnValue({ isOhd: true });

    const { result } = renderHook(() => useCombinedRegistryReferenceTypes());

    expect(result.current.registryReferenceTypes).toEqual([
        { id: 1 },
        { id: 2 },
    ]);
});

test('returns SWR status and error values', () => {
    const error = new Error('request failed');
    useSWRImmutable.mockReturnValue({
        isLoading: true,
        isValidating: false,
        data: undefined,
        error,
    });

    const { result } = renderHook(() => useCombinedRegistryReferenceTypes());

    expect(result.current).toMatchObject({
        isLoading: true,
        isValidating: false,
        error,
    });
});
