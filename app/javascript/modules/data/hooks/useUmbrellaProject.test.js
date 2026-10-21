import { renderHook } from '@testing-library/react';

import { useProjectDetail } from './useProjectDetail';
import { useUmbrellaProject } from './useUmbrellaProject';

jest.mock('react-redux', () => ({
    useSelector: () => ({ shortname: 'portal', name: 'Legacy name' }),
}));
jest.mock('../redux/selectors/dataSelectors', () => ({
    getUmbrellaProject: jest.fn(),
}));
jest.mock('./useProjectDetail', () => ({ useProjectDetail: jest.fn() }));

test('uses the bootstrap shortname for the request without returning bootstrap fields', () => {
    useProjectDetail.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(() => useUmbrellaProject());
    expect(useProjectDetail).toHaveBeenCalledWith('portal', {});
    expect(result.current.project).toBeUndefined();
    useProjectDetail.mockReturnValue({ project: { name: 'Localized name' } });
    rerender();
    expect(result.current.project.name).toBe('Localized name');
    useProjectDetail.mockReturnValue({ error: { message: 'Access denied' } });
    rerender();
    expect(result.current.project).toBeUndefined();
});
