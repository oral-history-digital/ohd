import React from 'react';
import { render } from 'react-dom';
import { Navigation } from 'react-router-dom'
import LocationsContainer from '../containers/LocationsContainer'

export default class InterviewLocations extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    componentDidMount() {
        if (!this.locationsLoaded()) {
            this.props.fetchInterview(this.context.router.route.match.params.archiveId);
        }
    }

    locationsLoaded() {
        return !this.props.isFetchingInterview && this.props.segments && this.props.archiveId === this.context.router.route.match.params.archiveId
    }

    handleClick(time, archiveId) {
        this.props.handleSegmentClick(time);
    }

    render() {
        return(
            <LocationsContainer 
                data={this.props.segments} 
                loaded={this.locationsLoaded()}
                handleClick={this.handleClick.bind(this)}
            />
        );
    }

}
