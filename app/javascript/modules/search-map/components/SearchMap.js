import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { useTrackPageView } from 'modules/analytics';
import { useIsEditor } from 'modules/archive';
import { getMapSections } from 'modules/data';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { MapComponent } from 'modules/map';
import { useProject, usePathBase } from 'modules/routes';
import { ScrollToTop } from 'modules/user-agent';
import { MapSpinnerOverlay } from 'modules/spinners';
import useSearchMap from '../search-map/useSearchMap';
import SearchMapPopup from './SearchMapPopup';
import MapFilterContainer from './MapFilterContainer';
import MapSectionsSelect from './MapSectionsSelect';
import MapNewBoundsSetter from './MapNewBoundsSetter';
import useMapLocations from '../useMapLocations';
import { setMapView } from '../actions';
import { getMapView } from '../selectors';

export default function SearchMap() {
    const mapSections = useSelector(getMapSections);
    const mapView = useSelector(getMapView);
    const isEditor = useIsEditor();
    const pathBase = usePathBase();
    const { project } = useProject();
    const [currentSection, setCurrentSection] = useState(mapSections[0].name);
    const { t } = useI18n();
    const dispatch = useDispatch();
    const { isLoading, markers, error } = useSearchMap();
    const { isLoading: locationsLoading } = useMapLocations();
    useTrackPageView();

    const defaultSection = mapSections.find(
        (section) => section.name === currentSection
    );
    const bounds = [
        [defaultSection.corner1_lat, defaultSection.corner1_lon],
        [defaultSection.corner2_lat, defaultSection.corner2_lon],
    ];

    function handleViewChange({ center, zoom }) {
        dispatch(
            setMapView({
                center,
                zoom,
            })
        );
    }

    if (!project.has_map) {
        return <Navigate to={`${pathBase}/not_found`} replace />;
    }

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('modules.search_map.title')}</title>
            </Helmet>

            <div className="wrapper-content map SearchMap">
                {isEditor && <HelpText code="search_map" className="u-mb" />}

                {error ? (
                    <div>
                        {t('modules.search_map.error')}: {error.message}
                    </div>
                ) : (
                    <MapComponent
                        className="Map--search"
                        loading={isLoading}
                        markers={markers || []}
                        popupComponent={SearchMapPopup}
                    >
                        <>
                            {locationsLoading && <MapSpinnerOverlay />}
                            <MapNewBoundsSetter
                                bounds={bounds}
                                view={mapView}
                                onViewChange={handleViewChange}
                            />
                        </>
                    </MapComponent>
                )}

                <div className="SearchMap-controls">
                    <MapFilterContainer />

                    <MapSectionsSelect
                        className="SearchMap-sections"
                        section={currentSection}
                        onChange={setCurrentSection}
                    />
                </div>
            </div>
        </ScrollToTop>
    );
}
