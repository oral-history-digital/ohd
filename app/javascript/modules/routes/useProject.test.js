import { renderHook } from '@testing-library/react';
import { useProjectDetail } from 'modules/data';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import useProject from './useProject';
import useProjectIdentity from './useProjectIdentity';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('react-router-dom', () => ({ useMatch: jest.fn() }));
jest.mock('modules/data', () => ({
    getProjectIdentities: jest.fn(),
    useProjectDetail: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
    useProjectDetail.mockReturnValue({});
});

test('identity reads keep the route shortname available without requesting details', () => {
    useSelector.mockReturnValue({
        7: { id: 7, shortname: 'pilot', is_umbrella: false },
    });
    useMatch.mockReturnValue({ params: { projectId: 'pilot', locale: 'en' } });
    const { result, rerender } = renderHook(() => useProjectIdentity());
    expect(result.current).toEqual({
        projectShortname: 'pilot',
        projectDbId: 7,
        isUmbrella: false,
    });

    useSelector.mockReturnValue({});
    useMatch.mockReturnValue({ params: { projectId: 'other', locale: 'en' } });
    rerender();
    expect(result.current).toEqual({
        projectShortname: 'other',
        projectDbId: undefined,
        isUmbrella: undefined,
    });
    expect(useProjectDetail).not.toHaveBeenCalled();
});

test('exposes umbrella role from configured flag rather than project shortname', () => {
    const umbrella = { id: 1, shortname: 'shared', is_umbrella: true };
    const archive = { id: 2, shortname: 'ohd', is_umbrella: false };
    useSelector.mockReturnValue({ 1: umbrella, 2: archive });
    useMatch.mockReturnValue({ params: { projectId: 'shared', locale: 'en' } });

    const { result, rerender } = renderHook(() => useProject());
    expect(result.current.project).toBeUndefined();
    expect(useProjectDetail).toHaveBeenCalledWith('shared', {});
    expect(result.current.isUmbrella).toBe(true);
    expect(result.current).not.toHaveProperty('isOhd');

    useMatch.mockReturnValue({ params: { projectId: 'ohd', locale: 'en' } });
    rerender();
    expect(result.current.project).toBeUndefined();
    expect(useProjectDetail).toHaveBeenLastCalledWith('ohd', {});
    expect(result.current.isUmbrella).toBe(false);
});

test('requests current route details by shortname without waiting for bootstrap', () => {
    useSelector.mockReturnValue({});
    useMatch.mockReturnValue({ params: { projectId: 'pilot', locale: 'en' } });
    const options = { profile: 'edit', include: ['access_config'] };
    const mutate = jest.fn();
    useProjectDetail.mockReturnValue({ isLoading: true, mutate });

    const { result, rerender } = renderHook(() => useProject(options));
    expect(useProjectDetail).toHaveBeenCalledWith('pilot', options);
    expect(result.current).toMatchObject({
        projectShortname: 'pilot',
        isLoading: true,
        mutate,
    });
    const project = { id: 7, shortname: 'pilot', is_umbrella: false };
    useProjectDetail.mockReturnValue({
        project,
        status: 'success',
        isLoading: false,
        mutate,
    });
    rerender();
    expect(result.current).toMatchObject({
        project,
        projectDbId: 7,
        isUmbrella: false,
        status: 'success',
    });
});

test('does not expose bootstrap records while details load or access is denied', () => {
    useSelector.mockReturnValue({
        7: { id: 7, shortname: 'pilot', access_config: { id: 99 } },
    });
    useMatch.mockReturnValue({ params: { projectId: 'pilot', locale: 'en' } });
    useProjectDetail.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(() => useProject());
    expect(result.current.project).toBeUndefined();
    const error = { status: 403, message: 'Denied' };
    useProjectDetail.mockReturnValue({ error, isLoading: false });
    rerender();
    expect(result.current.project).toBeUndefined();
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
});

test('resolves dedicated-domain requests by project shortname', () => {
    globalThis.railsMode = 'test';
    useSelector.mockReturnValue({
        7: {
            id: 7,
            shortname: 'pilot',
            archive_domain: window.location.origin,
        },
    });
    useMatch.mockReturnValue(null);
    const options = { include: ['footer'] };
    const { result } = renderHook(() => useProject(options));
    expect(useProjectDetail).toHaveBeenCalledWith('pilot', options);
    expect(result.current.projectShortname).toBe('pilot');
});
