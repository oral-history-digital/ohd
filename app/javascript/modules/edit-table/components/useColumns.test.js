import { renderHook } from '@testing-library/react';
import { useProject } from 'modules/routes';

import useColumns from './useColumns';

jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => true }),
}));
jest.mock('react-redux', () => ({
    useSelector: () => [
        'timecode',
        'transcript',
        'translation_eng',
        'mainheading_ger',
        'annotation_ger',
        'registry_references',
    ],
}));

const interview = {
    id: 7,
    translation_alpha3s: ['eng'],
    annotation_alpha3s: ['ger'],
};

test('columns wait for loaded project locales and disappear after an access failure', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(() => useColumns(interview));
    expect(result.current.columns).toEqual([]);
    useProject.mockReturnValue({ project: { available_locales: ['de'] } });
    rerender();
    expect(useProject).toHaveBeenCalledWith();
    expect(result.current.columns).toEqual([
        'timecode',
        'transcript',
        'translation_eng',
        'mainheading_ger',
        'registry_references',
        'annotation_ger',
    ]);
    useProject.mockReturnValue({
        project: { available_locales: ['de'] },
        error: { message: 'Access denied' },
    });
    rerender();
    expect(result.current.permittedColumns).toEqual([]);
});
