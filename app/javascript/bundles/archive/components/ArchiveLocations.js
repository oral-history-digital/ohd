import React from 'react';
import ArchiveUtils from '../../../lib/utils';
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
        this.props.searchInInterview({fulltext: this.props.fulltext, id: archiveId});
        this.context.router.history.push(`/${this.props.locale}/interviews/${archiveId}`);
    }

    locations() {
        let locations = [];
        for (let i = 0; i < this.props.foundInterviews.length; i++) {
            if (this.props.foundInterviews[i].interviewees.length){
                let loc = this.props.foundInterviews[i].interviewees[0].place_of_birth;
                if (loc) {
                    loc['names'] = this.props.foundInterviews[i].interviewees[0].names;
                    loc['archive_id'] = this.props.foundInterviews[i].archive_id;
                    locations = locations.concat(loc);
                }
            }
        }
        return locations;
    }

    popupContent(ref) {
        return (
            <div>
                <h3>
                    {`${ArchiveUtils.translate(this.props, 'place_of_birth')} ${ref.descriptor[this.props.locale]}`}:
                </h3>
                <div>
                    {`${this.props.interviewee.names[this.props.locale].firstname} ${this.props.interviewee.names[this.props.locale].lastname}`}
                </div>
            </div>
        )
    }

    render() {
        return(
            <LocationsContainer 
                data={this.locations()}
                loaded={this.locationsLoaded()}
                handleClick={this.handleClick.bind(this)}
                popupContent={this.popupContent.bind(this)}
            />
        );
    }

}
