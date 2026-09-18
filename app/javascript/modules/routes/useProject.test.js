import { renderHook } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import useProject from './useProject';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('react-router-dom', () => ({ useMatch: jest.fn() }));
jest.mock('modules/data', () => ({ getProjects: jest.fn() }));

test('exposes umbrella role from configured flag rather than project shortname', () => {
    const umbrella = { id: 1, shortname: 'shared', is_umbrella: true };
    const archive = { id: 2, shortname: 'ohd', is_umbrella: false };
    useSelector.mockReturnValue({ 1: umbrella, 2: archive });
    useMatch.mockReturnValue({ params: { projectId: 'shared', locale: 'en' } });

    const { result, rerender } = renderHook(() => useProject());
    expect(result.current.project).toEqual(umbrella);
    expect(result.current.isUmbrella).toBe(true);
    expect(result.current).not.toHaveProperty('isOhd');

    useMatch.mockReturnValue({ params: { projectId: 'ohd', locale: 'en' } });
    rerender();
    expect(result.current.project).toEqual(archive);
    expect(result.current.isUmbrella).toBe(false);
});
