/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';
import { MapContainer } from 'react-leaflet';

import MapComponent from './MapComponent';
import MapPopup from './MapPopup';

jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('react-leaflet', () => ({
    MapContainer: jest.fn(({ children }) => <div>{children}</div>),
    CircleMarker: ({ children }) => <div>{children}</div>,
    TileLayer: () => null,
}));
jest.mock(
    './MapResizeHandler',
    () =>
        function Resize() {
            return null;
        }
);
jest.mock(
    './MapTooltip',
    () =>
        function Tooltip({ placeName }) {
            return <p>{placeName}</p>;
        }
);
jest.mock('./MapPopup', () => jest.fn(() => null));

const marker = {
    id: 1,
    lat: 1,
    long: 2,
    labels: { en: 'English', de: 'German' },
    numReferences: 1,
    numMetadataReferences: 1,
    numSegmentReferences: 0,
    radius: 4,
    color: 'red',
};
const props = {
    popupComponent: () => null,
    bounds: [
        [1, 2],
        [3, 4],
    ],
    markers: [marker],
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: { default_locale: 'de' } });
});

test('keeps bounds and uses requested marker labels before the project fallback locale', () => {
    render(
        <MapComponent
            {...props}
            markers={[marker, { ...marker, id: 2, labels: { de: 'Fallback' } }]}
        />
    );
    expect(useProject).toHaveBeenCalledWith();
    expect(MapContainer.mock.calls.at(-1)[0]).toMatchObject({
        bounds: props.bounds,
        maxZoom: 16,
        scrollWheelZoom: false,
    });
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Fallback')).toBeInTheDocument();
    expect(MapPopup.mock.calls.map(([options]) => options.title)).toEqual([
        'English',
        'Fallback',
    ]);
});

test('waits for project locale settings and hides the map after access fails', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<MapComponent {...props} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(MapContainer).not.toHaveBeenCalled();
    useProject.mockReturnValue({
        project: { default_locale: 'de' },
        error: { message: 'Access denied' },
    });
    rerender(<MapComponent {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(MapContainer).not.toHaveBeenCalled();
});
