import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import LocationsContainer from './LocationsContainer'
import MapPopupContent from './MapPopupContent';

export default class InterviewLocations extends React.Component {
    constructor(props) {
        super(props);

        this.fetch = this.fetch.bind(this);
    }

    componentDidMount() {
        if (!this.props.locationsFetched) {
            this.fetch();
        }
    }

    fetch() {
        this.props.fetchLocations(`${pathBase(this.props)}/location`, this.props.archiveId);
    }

    render() {
        const { locationsFetched, currentLocations, loading, error } = this.props;

        return (
            <div>
                {
                    loading && <Spinner small style={{ marginBottom: '10px' }} />
                }
                {
                    error && !loading && (
                        <p style={{ lineHeight: '1.5rem' }}>
                            {t(this.props, 'modules.locations.error')} {error}
                        </p>
                    )
                }
                {
                    error && (
                        <button
                            type="button"
                            className={classNames('button', 'button--small')}
                            disabled={loading}
                            onClick={this.fetch}
                        >
                            {t(this.props, 'modules.locations.try_again')}
                        </button>
                    )
                }
                {
                    locationsFetched && currentLocations.length > 0 && (
                        <>
                            <div className='explanation'>{t(this.props, 'interview_map_explanation')}</div>
                            <LocationsContainer
                                data={currentLocations}
                                popupContent={location => <MapPopupContent location={location} />}
                            />
                        </>
                    )
                }
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
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    fetchLocations: PropTypes.func.isRequired,
};
