import React from 'react';
import PropTypes from 'prop-types';
import LocationsContainer from '../containers/LocationsContainer'
import { t, pathBase } from 'lib/utils';

export default class InterviewLocations extends React.Component {
    constructor(props) {
        super(props);

        this.popupContent = this.popupContent.bind(this);
    }

    componentDidMount() {
        if (!this.props.locationsFetched) {
            this.props.fetchLocations(`${pathBase(this.props)}/locations`, this.props.archiveId);
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
                    {
                        ref.name[this.props.locale] && (
                            <p>
                                {`${t(this.props, 'birth_location')}: ${ref.name[this.props.locale]}`}
                            </p>
                        )
                    }
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
        const { locationsFetched, currentLocations } = this.props;

        if (!currentLocations || currentLocations.length === 0) {
            return null;
        }

        return (
            <div>
                <div className='explanation'>{t(this.props, 'interview_map_explanation')}</div>
                <LocationsContainer
                    data={currentLocations}
                    loaded={locationsFetched}
                    popupContent={this.popupContent}
                />
            </div>
        );
    }
}

InterviewLocations.propTypes = {
    currentLocations: PropTypes.array.isRequired,
    locationsFetched: PropTypes.bool.isRequired,
    archiveId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    fetchLocations: PropTypes.func.isRequired,
    handleSegmentClick: PropTypes.func.isRequired,
};
