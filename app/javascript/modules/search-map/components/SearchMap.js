import { useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import { useTrackPageView } from 'modules/analytics';
import { useIsEditor } from 'modules/archive';
import { DEFAULT_MAP_SECTION } from 'modules/data';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { MapComponent } from 'modules/map';
import { usePathBase, useProject } from 'modules/routes';
import { MapSpinnerOverlay, Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
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

// Keep the effect's section dependency stable while project data is unavailable.
const EMPTY_MAP_SECTIONS = [];

/**
 * Shows project map search with configured sections and default bounds when none exist.
 *
 * @returns {React.ReactElement} Search map, project request status, or disabled-map redirect.
 */
export default function SearchMap() {
    const mapView = useSelector(getMapView);
    const isEditor = useIsEditor();
    const pathBase = usePathBase();
    const {
        project,
        isLoading: projectIsLoading,
        error: projectError,
    } = useProject({ include: ['map_sections'] });
    const mapSections = project?.map_sections || EMPTY_MAP_SECTIONS;

    const [currentSection, setCurrentSection] = useState(null);
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
        mapSections[0] ||
        DEFAULT_MAP_SECTION;

    const requestError = projectError || error;
    if (requestError) {
        return (
            <InlineNotification
                variant="error"
                title={t('modules.search_map.error')}
                description={requestError.message}
                isClosable={false}
            />
        );
    }
    if (projectIsLoading || !project) return <Spinner />;

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

                <div className="SearchMap-controls">
                    <MapFilterContainer />

                    <MapSectionsSelect
                        className="SearchMap-sections"
                        sections={mapSections}
                        section={currentSection || defaultSection.name}
                        onChange={setCurrentSection}
                    />
                </div>
            </div>
        </ScrollToTop>
    );
}
