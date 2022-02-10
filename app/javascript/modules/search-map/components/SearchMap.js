import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { ScrollToTop } from 'modules/user-agent';
import { getMapSections } from 'modules/data';
import { setSidebarTabsIndex, INDEX_MAP } from 'modules/sidebar';
import { MapComponent } from 'modules/map';
import { useI18n } from 'modules/i18n';
import SearchMapPopup from './SearchMapPopup';
import MapFilterContainer from './MapFilterContainer';
import MapSectionsSelect from './MapSectionsSelect';
import useSearchMap from '../search-map/useSearchMap';

export default function SearchMap() {
    const mapSections = useSelector(getMapSections);
    const [currentSection, setCurrentSection] = useState(mapSections[0].name);
    const { t } = useI18n();
    const dispatch = useDispatch();
    const { isLoading, markers, error } = useSearchMap();

    useEffect(() => {
        dispatch(setSidebarTabsIndex(INDEX_MAP));
    }, []);

    const defaultSection = mapSections.find(section => section.name === currentSection);
    const bounds = [
        [defaultSection.corner1_lat, defaultSection.corner1_lon],
        [defaultSection.corner2_lat, defaultSection.corner2_lon]
    ];

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('modules.search_map.title')}</title>
            </Helmet>
            <div className="wrapper-content map SearchMap">
                {
                    error ?
                        (<div>
                            {t('modules.search_map.error')}: {error.message}
                        </div>) :
                        (<MapComponent
                            className="Map--search"
                            loading={isLoading}
                            bounds={bounds}
                            markers={markers || []}
                            popupComponent={SearchMapPopup}
                        />)
                }

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
