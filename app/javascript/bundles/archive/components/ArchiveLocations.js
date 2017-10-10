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

    handleClick(time, archiveId) {
        //this.props.handleSegmentClick(0);
        this.context.router.history.push(`/${this.props.locale}/interviews/${archiveId}`);
    }

    render() {
        return(
            <LocationsContainer 
                data={this.props.foundInterviews}
                loaded={this.locationsLoaded()}
                handleClick={this.handleClick.bind(this)}
            />
        );
    }

}
