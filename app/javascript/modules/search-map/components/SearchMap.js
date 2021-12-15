import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { useDispatch, useSelector } from 'react-redux';

import { ScrollToTop } from 'modules/user-agent';
import { getCurrentProject } from 'modules/data';
import { setFlyoutTabsIndex, INDEX_MAP } from 'modules/flyout-tabs';
import { MapComponent } from 'modules/map';
import { useI18n } from 'modules/i18n';
import SearchMapPopup from './SearchMapPopup';
import MapFilterContainer from './MapFilterContainer';
import useSearchMap from '../search-map/useSearchMap';

import { AdminMenu } from 'modules/ui';
const Item = AdminMenu.Item;

export default function SearchMap() {
    const { t } = useI18n();
    const project = useSelector(getCurrentProject);
    const dispatch = useDispatch();
    const { isLoading, markers, error } = useSearchMap();

    useEffect(() => {
        dispatch(setFlyoutTabsIndex(INDEX_MAP));
    }, []);

    const mapCenter = project.map_initial_center_lat && project.map_initial_center_lon ?
        [project.map_initial_center_lat, project.map_initial_center_lon] :
        undefined;
    const mapZoom = project.map_initial_zoom ?
        project.map_initial_zoom :
        undefined;

    return (
        <ScrollToTop>
            <div className="wrapper-content map">
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
                            markers={markers || []}
                            popupComponent={SearchMapPopup}
                        />)
                }
                <MapFilterContainer />

                <AdminMenu>
                    <Item name="show" label="Anzeigen">
                        Hallo
                    </Item>
                    <Item name="edit" label="Bearbeiten" dialogTitle="Etwas anderes bearbeiten">
                        Welt
                    </Item>
                </AdminMenu>
            </div>
        </ScrollToTop>
    );
}
