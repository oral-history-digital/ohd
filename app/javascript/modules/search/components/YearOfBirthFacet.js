import PropTypes from 'prop-types';

import YearRange from './YearRange';

export default function YearOfBirthFacet({
    sliderMin,
    sliderMax,
}) {
    return (
        <div className="flyout-radio-container">
            <YearRange
                sliderMin={sliderMin}
                sliderMax={sliderMax}
            />
        </div>
    );
}

YearOfBirthFacet.propTypes = {
    data: PropTypes.object.isRequired,
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
};
