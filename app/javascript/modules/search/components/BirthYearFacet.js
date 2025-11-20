import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSearchParams } from 'modules/query-string';
import YearRange from './YearRange';

export default function BirthYearFacet({ sliderMin, sliderMax }) {
    const { yearOfBirthMin, yearOfBirthMax, setYearOfBirthRange } =
        useSearchParams();
    const [currentValue, setCurrentValue] = useState([
        yearOfBirthMin,
        yearOfBirthMax,
    ]);

    useEffect(() => {
        if (Number.isNaN(yearOfBirthMin) && Number.isNaN(yearOfBirthMax)) {
            setCurrentValue([sliderMin, sliderMax]);
        } else {
            setCurrentValue([yearOfBirthMin, yearOfBirthMax]);
        }
    }, [yearOfBirthMin, yearOfBirthMax]);

    function handleCompleteChange() {
        setYearOfBirthRange(...currentValue);
    }

    return (
        <YearRange
            currentValue={currentValue}
            sliderMin={sliderMin}
            sliderMax={sliderMax}
            onChange={setCurrentValue}
            onAfterChange={handleCompleteChange}
        />
    );
}

BirthYearFacet.propTypes = {
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
};
