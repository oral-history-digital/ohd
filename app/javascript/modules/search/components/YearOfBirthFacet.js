import PropTypes from 'prop-types';

import YearRange from './YearRange';

export default function YearOfBirthFacet({
    sliderMin,
    sliderMax,
}) {
    const style = { width: 400, paddingLeft: 11, paddingRight: 15 };

    return (
        <div className="flyout-radio-container" style={style}>
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
