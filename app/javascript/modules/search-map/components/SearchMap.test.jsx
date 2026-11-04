/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { DEFAULT_MAP_SECTION } from 'modules/data';
import { MapComponent } from 'modules/map';
import { useProject } from 'modules/routes';
import { MemoryRouter, useLocation } from 'react-router-dom';

import useSearchMap from '../search-map/useSearchMap';
import useMapLocations from '../useMapLocations';
import MapNewBoundsSetter from './MapNewBoundsSetter';
import SearchMap from './SearchMap';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => selector(),
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/pilot/en',
}));
jest.mock('modules/data', () => ({
    DEFAULT_MAP_SECTION: {
        name: 'default',
        corner1_lat: 51.50939,
        corner1_lon: -0.11832,
        corner2_lat: 44.433333,
        corner2_lon: 26.1,
    },
}));
jest.mock('modules/analytics', () => ({ useTrackPageView: jest.fn() }));
jest.mock('modules/archive', () => ({ useIsEditor: () => false }));
jest.mock('modules/help-text', () => ({ HelpText: () => null }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/map', () => ({
    MapComponent: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p>Loading project</p>,
    MapSpinnerOverlay: () => <p>Loading locations</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/user-agent', () => ({
    ScrollToTop: ({ children }) => children,
}));
jest.mock('react-helmet', () => ({ Helmet: () => null }));
jest.mock('@reach/listbox', () => ({
    Listbox: ({ children, value, onChange, ...props }) => (
        <select
            {...props}
            value={value}
            onChange={(event) => onChange(event.target.value)}
        >
            {children}
        </select>
    ),
    ListboxOption: ({ children, value }) => (
        <option value={value}>{children}</option>
    ),
}));
jest.mock('../selectors', () => ({
    getMapView: () => ({ center: [1, 2], zoom: 4 }),
}));
jest.mock('../search-map/useSearchMap', () => jest.fn());
jest.mock('../useMapLocations', () => jest.fn());
jest.mock(
    './MapFilterContainer',
    () =>
        function Filter() {
            return <p>Map filters</p>;
        }
);
jest.mock(
    './SearchMapPopup',
    () =>
        function Popup() {
            return null;
        }
);
jest.mock('./MapNewBoundsSetter', () =>
    jest.fn(({ bounds }) => (
        <p data-testid="bounds">{JSON.stringify(bounds)}</p>
    ))
);

const sections = [
    {
        name: 'first',
        label: 'Erster Ausschnitt',
        corner1_lat: 1,
        corner1_lon: 2,
        corner2_lat: 3,
        corner2_lon: 4,
    },
    {
        name: 'second',
        label: 'Zweiter Ausschnitt',
        corner1_lat: 10,
        corner1_lon: 20,
        corner2_lat: 30,
        corner2_lon: 40,
    },
];

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({
        project: { has_map: true, map_sections: sections },
    });
    useSearchMap.mockReturnValue({ markers: [] });
    useMapLocations.mockReturnValue({ isLoading: true });
});

test('waits for configured sections without showing fallback bounds and preserves localized selection', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <MemoryRouter>
            <SearchMap />
        </MemoryRouter>
    );
    expect(useProject).toHaveBeenCalledWith({ include: ['map_sections'] });
    expect(screen.getByText('Loading project')).toBeInTheDocument();
    expect(MapNewBoundsSetter).not.toHaveBeenCalled();
    useProject.mockReturnValue({
        project: { has_map: true, map_sections: sections },
    });
    rerender(
        <MemoryRouter>
            <SearchMap />
        </MemoryRouter>
    );
    expect(screen.getByTestId('bounds')).toHaveTextContent('[[1,2],[3,4]]');
    expect(
        screen.getByRole('option', { name: 'Erster Ausschnitt' })
    ).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'second' },
    });
    expect(screen.getByTestId('bounds')).toHaveTextContent('[[10,20],[30,40]]');
    useProject.mockReturnValue({
        project: {
            has_map: true,
            map_sections: sections.map((section) => ({
                ...section,
                label: section.name,
            })),
        },
    });
    rerender(
        <MemoryRouter>
            <SearchMap />
        </MemoryRouter>
    );
    expect(screen.getByRole('combobox')).toHaveValue('second');
    useProject.mockReturnValue({
        project: { has_map: true, map_sections: [sections[0]] },
    });
    rerender(
        <MemoryRouter>
            <SearchMap />
        </MemoryRouter>
    );
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByTestId('bounds')).toHaveTextContent('[[1,2],[3,4]]');
});

test('uses default bounds only after an empty configuration loads, retaining filters and saved view', () => {
    useProject.mockReturnValue({
        project: { has_map: true, map_sections: [] },
    });
    render(
        <MemoryRouter>
            <SearchMap />
        </MemoryRouter>
    );
    expect(MapNewBoundsSetter.mock.calls.at(-1)[0]).toMatchObject({
        bounds: [
            [DEFAULT_MAP_SECTION.corner1_lat, DEFAULT_MAP_SECTION.corner1_lon],
            [DEFAULT_MAP_SECTION.corner2_lat, DEFAULT_MAP_SECTION.corner2_lon],
        ],
        view: { center: [1, 2], zoom: 4 },
    });
    expect(screen.getByText('Map filters')).toBeInTheDocument();
    expect(screen.getByText('Loading locations')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
});

test('shows project and marker errors without retaining the map', () => {
    useProject.mockReturnValue({
        project: { has_map: true, map_sections: sections },
        error: { message: 'Access denied' },
    });
    const { rerender } = render(
        <MemoryRouter>
            <SearchMap />
        </MemoryRouter>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(MapComponent).not.toHaveBeenCalled();
    useProject.mockReturnValue({
        project: { has_map: true, map_sections: sections },
    });
    useSearchMap.mockReturnValue({
        error: { message: 'Reference types failed' },
    });
    rerender(
        <MemoryRouter>
            <SearchMap />
        </MemoryRouter>
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
        'Reference types failed'
    );
});

test('redirects disabled maps after project settings load even when there are no sections', async () => {
    useProject.mockReturnValue({ isLoading: true });
    function Location() {
        const location = useLocation();
        return <p>{location.pathname}</p>;
    }
    const { rerender } = render(
        <MemoryRouter initialEntries={['/pilot/en/searches/map']}>
            <SearchMap />
            <Location />
        </MemoryRouter>
    );
    useProject.mockReturnValue({
        project: { has_map: false, map_sections: [] },
    });
    rerender(
        <MemoryRouter initialEntries={['/pilot/en/searches/map']}>
            <SearchMap />
            <Location />
        </MemoryRouter>
    );
    expect(await screen.findByText('/pilot/en/not_found')).toBeInTheDocument();
    expect(MapComponent).not.toHaveBeenCalled();
});
