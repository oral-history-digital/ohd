import { useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import { useTrackPageView } from 'modules/analytics';
import { useIsEditor } from 'modules/archive';
import { getMapSections } from 'modules/data';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { MapComponent } from 'modules/map';
import { usePathBase, useProject } from 'modules/routes';
import { MapSpinnerOverlay } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { setMapView } from '../actions';
import useSearchMap from '../search-map/useSearchMap';
import { getMapView } from '../selectors';
import useMapLocations from '../useMapLocations';
import MapFilterContainer from './MapFilterContainer';
import MapNewBoundsSetter from './MapNewBoundsSetter';
import MapSectionsSelect from './MapSectionsSelect';
import SearchMapPopup from './SearchMapPopup';

export default function SearchMap() {
    const mapSections = useSelector(getMapSections);
    const mapView = useSelector(getMapView);
    const isEditor = useIsEditor();
    const pathBase = usePathBase();
    const { project } = useProject();

    const [currentSection, setCurrentSection] = useState(
        mapSections[0]?.name || null
    );
    const { t } = useI18n();
    const dispatch = useDispatch();
    const { isLoading, markers, error } = useSearchMap();
    const { isLoading: locationsLoading } = useMapLocations();
    useTrackPageView();

    // Map sections can arrive asynchronously after route changes.
    // Keep currentSection valid, otherwise we may keep a stale selection
    // and derive bounds from the wrong (or missing) section.
    useEffect(() => {
        if (!mapSections.length) {
            return;
        }

        const selectedSectionExists = mapSections.some(
            (section) => section.name === currentSection
        );

        // If the current section is missing, reset to the first one.
        // This can happen when sections are loaded asynchronously after route changes.
        if (!selectedSectionExists) {
            setCurrentSection(mapSections[0].name);
        }
    }, [mapSections, currentSection]);

    const defaultSection =
        mapSections.find((section) => section.name === currentSection) ||
        mapSections[0];

    if (!defaultSection) {
        return null;
    }

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

    if (project && !project.has_map) {
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
