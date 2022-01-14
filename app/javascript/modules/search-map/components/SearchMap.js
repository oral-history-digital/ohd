import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useDispatch, useSelector } from 'react-redux';
import { Listbox, ListboxInput, ListboxButton, ListboxPopover,  ListboxList,  ListboxOption,} from '@reach/listbox';
import '@reach/listbox/styles.css';

import { ScrollToTop } from 'modules/user-agent';
import { getCurrentProject, getMapSections } from 'modules/data';
import { setSidebarTabsIndex, INDEX_MAP } from 'modules/sidebar';
import { MapComponent } from 'modules/map';
import { useI18n } from 'modules/i18n';
import SearchMapPopup from './SearchMapPopup';
import MapFilterContainer from './MapFilterContainer';
import useSearchMap from '../search-map/useSearchMap';

export default function SearchMap() {
    const mapSections = useSelector(getMapSections);
    const [currentSection, setCurrentSection] = useState(mapSections[0].name);
    const { t, locale } = useI18n();
    const project = useSelector(getCurrentProject);
    const dispatch = useDispatch();
    const { isLoading, markers, error } = useSearchMap();

    useEffect(() => {
        dispatch(setSidebarTabsIndex(INDEX_MAP));
    }, []);

    const mapCenter = project.map_initial_center_lat && project.map_initial_center_lon ?
        [project.map_initial_center_lat, project.map_initial_center_lon] :
        undefined;
    const mapZoom = project.map_initial_zoom ?
        project.map_initial_zoom :
        undefined;

    const defaultSection = mapSections.find(section => section.name === currentSection);
    const bounds = [
        [defaultSection.corner1_lat, defaultSection.corner1_lon],
        [defaultSection.corner2_lat, defaultSection.corner2_lon]
    ];

    return (
        <ScrollToTop>
            <div className="wrapper-content map">
                {mapSections.length > 1 && (
                    <div className="u-mb">
                        <span id="map_section">Kartenausschnitt</span>
                        <Listbox
                            aria-labelledby="map_section"
                            value={currentSection}
                            onChange={setCurrentSection}
                        >
                            {
                                mapSections.map(section => (
                                    <ListboxOption
                                        key={section.name}
                                        value={section.name}
                                    >
                                        {section.label[locale]}
                                    </ListboxOption>
                                ))
                            }
                        </Listbox>
                    </div>
                )}

                {
                    error ?
                        (<div>
                            {t('modules.search_map.error')}: {error.message}
                        </div>) :
                        (<MapComponent
                            className="Map--search"
                            loading={isLoading}
                            initialCenter={mapCenter}
                            initialZoom={mapZoom}
                            bounds={bounds}
                            markers={markers || []}
                            popupComponent={SearchMapPopup}
                        />)
                }

                <MapFilterContainer />
            </div>
        </ScrollToTop>
    );
}
