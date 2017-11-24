import React from 'react';
import { render } from 'react-dom';
import { Navigation } from 'react-router-dom'
import LocationsContainer from '../containers/LocationsContainer'

export default class ArchiveLocations extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    locationsLoaded() {
        return !this.props.isArchiveSearching && this.props.foundInterviews.length > 0;
    }

    handleClick(segmentId, archiveId) {
        this.props.searchInInterview({fulltext: this.props.fulltext, id: archiveId})
        this.context.router.history.push(`/${this.props.locale}/interviews/${archiveId}`);
    }

    locations() {
        let locations = [];

        for (let i = 0; i < this.props.foundInterviews.length; i++) {
            locations = locations.concat(this.props.foundInterviews[i].references);
        }

        return locations;
    }

    render() {
        return(
            <LocationsContainer 
                data={this.locations()}
                loaded={this.locationsLoaded()}
                handleClick={this.handleClick.bind(this)}
            />
        );
    }

}
