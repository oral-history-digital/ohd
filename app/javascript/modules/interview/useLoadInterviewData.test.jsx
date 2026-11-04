import { renderHook } from '@testing-library/react';
import { fetchData } from 'modules/data';
import { usePathBase, useProject } from 'modules/routes';

import useLoadInterviewData from './useLoadInterviewData';

const mockDispatch = jest.fn();
let mockState;
let mockAccessGranted;
let mockCanEdit;

jest.mock('modules/archive', () => ({
    getEditView: (state) => state.editView,
}));
jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => mockCanEdit }),
    useProjectAccessStatus: () => ({ projectAccessGranted: mockAccessGranted }),
}));
jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'FETCH_INTERVIEW' })),
    getInterviewsStatus: (state) => state.statuses,
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: jest.fn(),
}));
jest.mock('modules/user', () => ({
    getIsLoggedIn: (state) => state.isLoggedIn,
}));
jest.mock('react-redux', () => ({
    useSelector: (selector) => selector(mockState),
    useDispatch: () => mockDispatch,
}));

const interview = { archive_id: 'H-001', primary_language_id: 1 };
const metadata = [
    {
        name: 'observations',
        use_in_details_view: true,
        display_on_landing_page: false,
    },
    {
        name: 'description',
        use_in_details_view: true,
        display_on_landing_page: true,
    },
];

beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
        statuses: { 'H-001': 'fetched' },
        editView: false,
        isLoggedIn: false,
    };
    mockAccessGranted = false;
    mockCanEdit = false;
    usePathBase.mockReturnValue('/history/en');
    useProject.mockReturnValue({ project: { metadata_fields: metadata } });
});

test('waits for project metadata and skips requests after denial', () => {
    mockState.statuses = {};
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = renderHook(() =>
        useLoadInterviewData({ archiveId: 'H-001' })
    );
    expect(useProject).toHaveBeenCalledWith({ include: ['metadata_fields'] });
    expect(mockDispatch).not.toHaveBeenCalled();

    useProject.mockReturnValue({
        error: { status: 403, message: 'Access denied' },
    });
    rerender();
    expect(mockDispatch).not.toHaveBeenCalled();

    useProject.mockReturnValue({ project: { metadata_fields: [] } });
    rerender();
    expect(fetchData).toHaveBeenCalledTimes(1);
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/history/en' },
        'interviews',
        'H-001'
    );
    mockState.statuses = { 'H-001': 'fetching' };
    rerender();
    expect(fetchData).toHaveBeenCalledTimes(1);
});

test.each([
    ['visitor', false, false, ['description']],
    [
        'project access',
        true,
        false,
        [
            'description',
            'title',
            'short_title',
            'photos',
            'registry_references',
            'observations',
        ],
    ],
    [
        'editor',
        true,
        true,
        [
            'description',
            'title',
            'short_title',
            'photos',
            'registry_references',
            'observations',
            'reload_translations',
        ],
    ],
])('preserves field loading for %s', (_, accessGranted, canEdit, fields) => {
    mockAccessGranted = accessGranted;
    mockCanEdit = canEdit;
    const { rerender } = renderHook(() =>
        useLoadInterviewData({ interview, archiveId: 'H-001' })
    );
    expect(fetchData.mock.calls.map((call) => call[3])).toEqual(fields);
    expect(mockDispatch).toHaveBeenCalledTimes(fields.length);

    useProject.mockReturnValue({ project: { metadata_fields: metadata } });
    rerender();
    expect(fetchData).toHaveBeenCalledTimes(fields.length);
});

test('reloads on access changes and lets editors load fields hidden from both display views', () => {
    useProject.mockReturnValue({
        project: {
            metadata_fields: [
                {
                    name: 'observations',
                    use_in_details_view: false,
                    display_on_landing_page: false,
                },
                {
                    name: 'description',
                    use_in_details_view: false,
                    display_on_landing_page: false,
                },
            ],
        },
    });
    const { rerender } = renderHook(() =>
        useLoadInterviewData({ interview, archiveId: 'H-001' })
    );
    expect(mockDispatch).not.toHaveBeenCalled();
    mockCanEdit = true;
    rerender();
    expect(fetchData.mock.calls.map((call) => call[3])).toEqual([
        'reload_translations',
        'observations',
        'description',
    ]);
});

test('uses locale-only routes on dedicated project domains and refetches after locale changes', () => {
    usePathBase.mockReturnValue('/en');
    const { rerender } = renderHook(() =>
        useLoadInterviewData({ interview, archiveId: 'H-001' })
    );
    expect(fetchData).toHaveBeenLastCalledWith(
        { pathBase: '/en' },
        'interviews',
        'H-001',
        'description'
    );
    usePathBase.mockReturnValue('/de');
    rerender();
    expect(fetchData).toHaveBeenLastCalledWith(
        { pathBase: '/de' },
        'interviews',
        'H-001',
        'description'
    );
});
