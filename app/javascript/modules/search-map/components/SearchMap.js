import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { useDispatch } from 'react-redux';

import { ScrollToTop } from 'modules/user-agent';
import { setFlyoutTabsIndex, INDEX_MAP } from 'modules/flyout-tabs';
import { MapComponent } from 'modules/map';
import { useI18n } from 'modules/i18n';
import SearchMapPopup from './SearchMapPopup';
import MapFilterContainer from './MapFilterContainer';
import useSearchMap from '../search-map/useSearchMap';

export default function SearchMap() {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const { isLoading, markers, error } = useSearchMap();

    useEffect(() => {
        dispatch(setFlyoutTabsIndex(INDEX_MAP));
    }, []);

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
                            markers={markers || []}
                            popupComponent={SearchMapPopup}
                        />)
                }
                <MapFilterContainer />
            </div>
        </ScrollToTop>
    );
}