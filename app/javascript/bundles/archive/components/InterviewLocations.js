import React from 'react';
import PropTypes from 'prop-types';
import LocationsContainer from '../containers/LocationsContainer'
import { t, pathBase } from '../../../lib/utils';

export default class InterviewLocations extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
    }

    componentDidMount() {
        if (!this.locationsLoaded()) {
            this.props.fetchLocations(`${pathBase(this.props)}/locations`, this.props.archiveId);
        }
    }

    locationsLoaded() {
        return this.props.locations[this.props.archiveId] &&
            (this.props.archiveId === this.props.match.params.archiveId);
    }

    birthLocation(ref) {
        if (ref.name[this.props.locale]) {
            return (
                <p>
                    {`${t(this.props, 'birth_location')}: ${ref.name[this.props.locale]}`}
                </p>
            )
        }
    }

    popupContent(ref) {
        if (ref.ref_object) {
            return (
                <div onClick={() => this.props.handleSegmentClick(ref.ref_object.tape_number, ref.ref_object.time)}>
                    <p>
                        <em className='place'>
                            {ref.desc[this.props.locale]}
                        </em>
                        {t(this.props, 'interview_location_desc_one')}
                        <em className='chapter'>
                            {ref.ref_object.last_heading[this.props.locale]}
                        </em>
                        {t(this.props, 'interview_location_desc_two')}

                    </p>
                </div>
            )
        } else if (ref.name) {
            return (
                <div>
                    {this.birthLocation(ref)}
                    <div>
                        {`${ref.names[this.props.locale].firstname} ${ref.names[this.props.locale].lastname}`}
                    </div>
                </div>
            )
        } else {
            return (
                <p>
                    {ref.desc[this.props.locale]}
                </p>
            )
        }
    }

    render() {
        let locations = this.props.locations[this.props.archiveId]
        if (locations) {
            locations =  locations.filter(l => l.ref_object);
        }
        if (locations && this.props.birthLocation) {
            locations.push(this.props.birthLocation);
        }
        if (locations && locations.length > 0){
            return (
                <div>
                    <div className='explanation'>{t(this.props, 'interview_map_explanation')}</div>
                    <LocationsContainer
                        data={locations}
                        loaded={this.locationsLoaded()}
                        popupContent={this.popupContent.bind(this)}
                    />
                </div>
            );
        }
        else {
            return null;
        }
    }

}
