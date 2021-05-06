import React from 'react';
import PropTypes from 'prop-types';

import { pathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';

export default class MapSearch extends React.Component {
    componentDidMount() {
        if (this.props.markersFetched) {
            this.initMap();
        } else {
            this.search();
        }
    }

    search(query={}) {
        let url = `${pathBase(this.props)}/searches/map`;
        this.props.searchInMap(url, query);
    }

    render() {
        return (
            <ScrollToTop>
                <div className='wrapper-content map'>
                    <Spinner />
                </div>
            </ScrollToTop>
        )
    }
}

MapSearch.propTypes = {
    markersFetched: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMapSearching: PropTypes.bool,
    query: PropTypes.object.isRequired,
    foundMarkers: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    searchInMap: PropTypes.func.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
