import { Component } from 'react';
import PropTypes from 'prop-types';

import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import LocationsContainer from './LocationsContainer'
import MapPopupContent from './MapPopupContent';

export default class InterviewLocations extends Component {
    componentDidMount() {
        if (!this.props.locationsFetched) {
            this.props.fetchLocations(`${pathBase(this.props)}/locations`, this.props.archiveId);
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
                    popupContent={location => <MapPopupContent location={location} />}
                />
            </div>
        );
    }
}

InterviewLocations.propTypes = {
    currentLocations: PropTypes.array,
    locationsFetched: PropTypes.bool.isRequired,
    archiveId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    fetchLocations: PropTypes.func.isRequired,
};
