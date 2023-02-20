import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';

import { ScrollToTop } from 'modules/user-agent';
import { getMapSections } from 'modules/data';
import { useIsEditor } from 'modules/archive';
import { MapComponent } from 'modules/map';
import { useI18n } from 'modules/i18n';
import { HelpText } from 'modules/help-text';
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

    const [currentSection, setCurrentSection] = useState(mapSections[0].name);
    const { t } = useI18n();
    const dispatch = useDispatch();
    const { isLoading, markers, error } = useSearchMap();
    const { isLoading: locationsLoading } = useMapLocations();

    const defaultSection = mapSections.find(section => section.name === currentSection);
    const bounds = [
        [defaultSection.corner1_lat, defaultSection.corner1_lon],
        [defaultSection.corner2_lat, defaultSection.corner2_lon]
    ];

    function handleViewChange({ center, zoom }) {
        dispatch(setMapView({
            center,
            zoom,
        }));
    }

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('modules.search_map.title')}</title>
            </Helmet>

            <div className="wrapper-content map SearchMap">
                {isEditor && <HelpText code="search_map" className="u-mb" />}

                <div className={classNames('LoadingOverlay', {
                    'is-loading': locationsLoading,
                })}>
                    {
                        error ?
                            (<div>
                                {t('modules.search_map.error')}: {error.message}
                            </div>) :
                            (<MapComponent
                                className="Map--search"
                                loading={isLoading}
                                markers={markers || []}
                                popupComponent={SearchMapPopup}
                            >
                                <MapNewBoundsSetter
                                    bounds={bounds}
                                    view={mapView}
                                    onViewChange={handleViewChange}
                                />
                            </MapComponent>)
                    }
                </div>

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
