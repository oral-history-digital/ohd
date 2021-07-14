import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { useDispatch } from 'react-redux';

import { ScrollToTop } from 'modules/user-agent';
import { setFlyoutTabsIndex, INDEX_MAP } from 'modules/flyout-tabs';
import { MapComponent } from 'modules/map';
import SearchMapPopup from './SearchMapPopup';
import MapFilterContainer from './MapFilterContainer';
import useSearchMap from '../useSearchMap';

export default function SearchMap() {
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
                            Error loading map: {error.message}
                        </div>) :
                        (<MapComponent
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
